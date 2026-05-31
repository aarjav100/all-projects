import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Users, Lock, Globe, Search, MessageCircle, FileText } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  avatar_url: string | null;
  is_private: boolean;
  member_count: number;
  created_at: string;
  created_by: string;
}

interface CommunityMember {
  community_id: string;
  user_id: string;
  role: string;
}

export default function Communities() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    is_private: false,
  });

  const { data: communities, isLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("member_count", { ascending: false });
      if (error) throw error;
      return data as Community[];
    },
  });

  const { data: myMemberships } = useQuery({
    queryKey: ["my-community-memberships", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("community_members")
        .select("community_id, user_id, role")
        .eq("user_id", user.id);
      if (error) throw error;
      return data as CommunityMember[];
    },
    enabled: !!user?.id,
  });

  const createCommunity = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { data: community, error: communityError } = await supabase
        .from("communities")
        .insert({
          name: newCommunity.name,
          description: newCommunity.description,
          is_private: newCommunity.is_private,
          created_by: user.id,
          member_count: 1,
        })
        .select()
        .single();

      if (communityError) throw communityError;

      const { error: memberError } = await supabase
        .from("community_members")
        .insert({
          community_id: community.id,
          user_id: user.id,
          role: "owner",
        });

      if (memberError) throw memberError;

      return community;
    },
    onSuccess: (community) => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["my-community-memberships"] });
      setIsCreateOpen(false);
      setNewCommunity({ name: "", description: "", is_private: false });
      toast.success("Community created!");
      navigate(`/community/${community.id}`);
    },
    onError: (error) => {
      toast.error("Failed to create community");
      console.error(error);
    },
  });

  const joinCommunity = useMutation({
    mutationFn: async (communityId: string) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("community_members")
        .insert({
          community_id: communityId,
          user_id: user.id,
          role: "member",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["my-community-memberships"] });
      toast.success("Joined community!");
    },
    onError: (error) => {
      toast.error("Failed to join community");
      console.error(error);
    },
  });

  const filteredCommunities = communities?.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myCommunities = filteredCommunities?.filter((c) =>
    myMemberships?.some((m) => m.community_id === c.id)
  );

  const discoverCommunities = filteredCommunities?.filter((c) =>
    !myMemberships?.some((m) => m.community_id === c.id)
  );

  const isMember = (communityId: string) =>
    myMemberships?.some((m) => m.community_id === communityId);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-6 px-4 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Communities</h1>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Community</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                    placeholder="Community name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                    placeholder="What's this community about?"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="private">Private Community</Label>
                    <p className="text-sm text-muted-foreground">Only invited members can join</p>
                  </div>
                  <Switch
                    id="private"
                    checked={newCommunity.is_private}
                    onCheckedChange={(checked) => setNewCommunity({ ...newCommunity, is_private: checked })}
                  />
                </div>
                <Button
                  onClick={() => createCommunity.mutate()}
                  disabled={!newCommunity.name || createCommunity.isPending}
                  className="w-full"
                >
                  {createCommunity.isPending ? "Creating..." : "Create Community"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities..."
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="my" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="my" className="flex-1">My Communities</TabsTrigger>
            <TabsTrigger value="discover" className="flex-1">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : myCommunities?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>You haven't joined any communities yet</p>
              </div>
            ) : (
              myCommunities?.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isMember={true}
                  onJoin={() => {}}
                  onClick={() => navigate(`/community/${community.id}`)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : discoverCommunities?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No communities to discover</p>
              </div>
            ) : (
              discoverCommunities?.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isMember={false}
                  onJoin={() => joinCommunity.mutate(community.id)}
                  onClick={() => navigate(`/community/${community.id}`)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function CommunityCard({
  community,
  isMember,
  onJoin,
  onClick,
}: {
  community: Community;
  isMember: boolean;
  onJoin: () => void;
  onClick: () => void;
}) {
  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onClick}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={community.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg">
            {community.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg truncate">{community.name}</CardTitle>
            {community.is_private ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <CardDescription className="line-clamp-2">
            {community.description || "No description"}
          </CardDescription>
        </div>
        {!isMember && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onJoin();
            }}
          >
            Join
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{community.member_count} members</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Topics</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
