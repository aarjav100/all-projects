import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Plus, Users, MessageCircle, FileText, Settings, Pin, Lock, Video } from "lucide-react";
import GroupChat from "@/components/community/GroupChat";

interface Community {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  avatar_url: string | null;
  is_private: boolean;
  member_count: number;
  created_by: string;
}

interface GroupChatType {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  is_private: boolean;
  community_id: string | null;
}

interface ForumTopic {
  id: string;
  title: string;
  description: string | null;
  is_pinned: boolean;
  is_locked: boolean;
  post_count: number;
  last_activity_at: string;
  created_by: string;
}

interface Member {
  user_id: string;
  role: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState(false);
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", description: "" });
  const [newChat, setNewChat] = useState({ name: "", description: "" });

  const { data: community, isLoading: loadingCommunity } = useQuery({
    queryKey: ["community", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Community;
    },
    enabled: !!id,
  });

  const { data: membership } = useQuery({
    queryKey: ["community-membership", id, user?.id],
    queryFn: async () => {
      if (!user?.id || !id) return null;
      const { data, error } = await supabase
        .from("community_members")
        .select("*")
        .eq("community_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!id,
  });

  const { data: groupChats } = useQuery({
    queryKey: ["community-group-chats", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_chats")
        .select("*")
        .eq("community_id", id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as GroupChatType[];
    },
    enabled: !!id,
  });

  const { data: forumTopics } = useQuery({
    queryKey: ["community-forum-topics", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select("*")
        .eq("community_id", id)
        .order("is_pinned", { ascending: false })
        .order("last_activity_at", { ascending: false });
      if (error) throw error;
      return data as ForumTopic[];
    },
    enabled: !!id,
  });

  const { data: members } = useQuery({
    queryKey: ["community-members", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_members")
        .select(`
          user_id,
          role,
          profiles:user_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq("community_id", id)
        .order("role", { ascending: true });
      if (error) throw error;
      return data as unknown as Member[];
    },
    enabled: !!id,
  });

  const createTopic = useMutation({
    mutationFn: async () => {
      if (!user?.id || !id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("forum_topics")
        .insert({
          community_id: id,
          title: newTopic.title,
          description: newTopic.description,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-forum-topics", id] });
      setIsCreateTopicOpen(false);
      setNewTopic({ title: "", description: "" });
      toast.success("Topic created!");
    },
    onError: (error) => {
      toast.error("Failed to create topic");
      console.error(error);
    },
  });

  const createGroupChat = useMutation({
    mutationFn: async () => {
      if (!user?.id || !id) throw new Error("Not authenticated");
      
      const { data: chat, error: chatError } = await supabase
        .from("group_chats")
        .insert({
          community_id: id,
          name: newChat.name,
          description: newChat.description,
          created_by: user.id,
        })
        .select()
        .single();

      if (chatError) throw chatError;

      const { error: memberError } = await supabase
        .from("group_chat_members")
        .insert({
          group_chat_id: chat.id,
          user_id: user.id,
          role: "owner",
        });

      if (memberError) throw memberError;

      return chat;
    },
    onSuccess: (chat) => {
      queryClient.invalidateQueries({ queryKey: ["community-group-chats", id] });
      setIsCreateChatOpen(false);
      setNewChat({ name: "", description: "" });
      setSelectedChat(chat.id);
      toast.success("Chat room created!");
    },
    onError: (error) => {
      toast.error("Failed to create chat room");
      console.error(error);
    },
  });

  const isAdmin = membership?.role === "owner" || membership?.role === "admin" || membership?.role === "moderator";

  if (loadingCommunity) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!community) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="text-muted-foreground">Community not found</div>
          <Button onClick={() => navigate("/communities")}>Back to Communities</Button>
        </div>
      </MainLayout>
    );
  }

  if (selectedChat) {
    return (
      <MainLayout hideNav>
        <GroupChat
          groupChatId={selectedChat}
          onBack={() => setSelectedChat(null)}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto pb-24">
        {/* Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
          <div className="px-4 -mt-12">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={community.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {community.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pb-2">
                <h1 className="text-2xl font-bold">{community.name}</h1>
                <p className="text-muted-foreground">{community.member_count} members</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => navigate("/communities")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            {community.description && (
              <p className="mt-4 text-muted-foreground">{community.description}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 px-4">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1 gap-2">
              <MessageCircle className="h-4 w-4" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex-1 gap-2">
              <FileText className="h-4 w-4" />
              Topics
            </TabsTrigger>
            <TabsTrigger value="members" className="flex-1 gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Chat Rooms</h2>
              {isAdmin && (
                <Dialog open={isCreateChatOpen} onOpenChange={setIsCreateChatOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Chat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Chat Room</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="chat-name">Name</Label>
                        <Input
                          id="chat-name"
                          value={newChat.name}
                          onChange={(e) => setNewChat({ ...newChat, name: e.target.value })}
                          placeholder="Chat room name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="chat-description">Description</Label>
                        <Textarea
                          id="chat-description"
                          value={newChat.description}
                          onChange={(e) => setNewChat({ ...newChat, description: e.target.value })}
                          placeholder="What's this chat room for?"
                        />
                      </div>
                      <Button
                        onClick={() => createGroupChat.mutate()}
                        disabled={!newChat.name || createGroupChat.isPending}
                        className="w-full"
                      >
                        {createGroupChat.isPending ? "Creating..." : "Create Chat Room"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {groupChats?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No chat rooms yet</p>
              </div>
            ) : (
              groupChats?.map((chat) => (
                <Card
                  key={chat.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 py-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <MessageCircle className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{chat.name}</CardTitle>
                      {chat.description && (
                        <CardDescription className="truncate">{chat.description}</CardDescription>
                      )}
                    </div>
                    {chat.is_private && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="topics" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Forum Topics</h2>
              {membership && (
                <Dialog open={isCreateTopicOpen} onOpenChange={setIsCreateTopicOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Topic
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Topic</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="topic-title">Title</Label>
                        <Input
                          id="topic-title"
                          value={newTopic.title}
                          onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                          placeholder="Topic title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="topic-description">Description</Label>
                        <Textarea
                          id="topic-description"
                          value={newTopic.description}
                          onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                          placeholder="What would you like to discuss?"
                        />
                      </div>
                      <Button
                        onClick={() => createTopic.mutate()}
                        disabled={!newTopic.title || createTopic.isPending}
                        className="w-full"
                      >
                        {createTopic.isPending ? "Creating..." : "Create Topic"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {forumTopics?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No topics yet</p>
              </div>
            ) : (
              forumTopics?.map((topic) => (
                <Card
                  key={topic.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/topic/${topic.id}`)}
                >
                  <CardHeader className="py-4">
                    <div className="flex items-start gap-2">
                      {topic.is_pinned && <Pin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{topic.title}</CardTitle>
                          {topic.is_locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        {topic.description && (
                          <CardDescription className="line-clamp-2 mt-1">{topic.description}</CardDescription>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{topic.post_count} posts</span>
                          <span>Last activity {new Date(topic.last_activity_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-4 mt-4">
            <h2 className="font-semibold">Members ({members?.length || 0})</h2>
            {members?.map((member) => (
              <Card
                key={member.user_id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate(`/user/${member.profiles.username}`)}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <Avatar>
                    <AvatarImage src={member.profiles.avatar_url || undefined} />
                    <AvatarFallback>
                      {(member.profiles.display_name || member.profiles.username)?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {member.profiles.display_name || member.profiles.username}
                    </p>
                    <p className="text-sm text-muted-foreground">@{member.profiles.username}</p>
                  </div>
                  <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
