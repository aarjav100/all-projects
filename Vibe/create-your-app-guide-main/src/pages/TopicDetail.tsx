import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Send, Pin, Lock, Check, ThumbsUp, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface Topic {
  id: string;
  title: string;
  description: string | null;
  is_pinned: boolean;
  is_locked: boolean;
  post_count: number;
  created_by: string;
  created_at: string;
  community_id: string;
}

interface ForumPost {
  id: string;
  content: string;
  is_solution: boolean;
  like_count: number;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");

  const { data: topic, isLoading: loadingTopic } = useQuery({
    queryKey: ["forum-topic", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Topic;
    },
    enabled: !!id,
  });

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ["forum-posts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`
          id,
          content,
          is_solution,
          like_count,
          created_at,
          user_id,
          profiles:user_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq("topic_id", id)
        .order("is_solution", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as unknown as ForumPost[];
    },
    enabled: !!id,
  });

  const { data: topicCreator } = useQuery({
    queryKey: ["topic-creator", topic?.created_by],
    queryFn: async () => {
      if (!topic?.created_by) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url")
        .eq("user_id", topic.created_by)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!topic?.created_by,
  });

  const createPost = useMutation({
    mutationFn: async () => {
      if (!user?.id || !id) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("forum_posts")
        .insert({
          topic_id: id,
          user_id: user.id,
          content: newPost.trim(),
        });

      if (error) throw error;

      // Update post count and last activity
      await supabase
        .from("forum_topics")
        .update({
          post_count: (topic?.post_count || 0) + 1,
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts", id] });
      queryClient.invalidateQueries({ queryKey: ["forum-topic", id] });
      setNewPost("");
      toast.success("Reply posted!");
    },
    onError: (error) => {
      toast.error("Failed to post reply");
      console.error(error);
    },
  });

  const markAsSolution = useMutation({
    mutationFn: async (postId: string) => {
      // First, unmark any existing solution
      await supabase
        .from("forum_posts")
        .update({ is_solution: false })
        .eq("topic_id", id);

      // Then mark the new solution
      const { error } = await supabase
        .from("forum_posts")
        .update({ is_solution: true })
        .eq("id", postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts", id] });
      toast.success("Marked as solution!");
    },
    onError: (error) => {
      toast.error("Failed to mark as solution");
      console.error(error);
    },
  });

  const isTopicOwner = user?.id === topic?.created_by;

  if (loadingTopic) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!topic) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="text-muted-foreground">Topic not found</div>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-6 px-4 pb-24">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/community/${topic.community_id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {topic.is_pinned && <Pin className="h-4 w-4 text-primary" />}
              <h1 className="text-xl font-bold">{topic.title}</h1>
              {topic.is_locked && (
                <Badge variant="secondary">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
            </div>
            {topic.description && (
              <p className="text-muted-foreground mt-2">{topic.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={topicCreator?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {(topicCreator?.display_name || topicCreator?.username)?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{topicCreator?.display_name || topicCreator?.username}</span>
              </div>
              <span>•</span>
              <span>{format(new Date(topic.created_at), "MMM d, yyyy")}</span>
              <span>•</span>
              <span>{topic.post_count} replies</span>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {loadingPosts ? (
            <div className="text-center py-12 text-muted-foreground">Loading replies...</div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No replies yet. Be the first to respond!</p>
            </div>
          ) : (
            posts?.map((post) => (
              <Card key={post.id} className={post.is_solution ? "border-green-500 bg-green-500/5" : ""}>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <Avatar
                    className="cursor-pointer"
                    onClick={() => navigate(`/user/${post.profiles?.username}`)}
                  >
                    <AvatarImage src={post.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {(post.profiles?.display_name || post.profiles?.username)?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {post.profiles?.display_name || post.profiles?.username}
                      </span>
                      {post.is_solution && (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Solution
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(post.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{post.content}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.like_count}
                    </Button>
                    {isTopicOwner && !post.is_solution && !topic.is_locked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600"
                        onClick={() => markAsSolution.mutate(post.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark as Solution
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Reply Input */}
        {!topic.is_locked && user && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Write your reply..."
                rows={4}
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => createPost.mutate()}
                  disabled={!newPost.trim() || createPost.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {createPost.isPending ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {topic.is_locked && (
          <Card className="mt-6">
            <CardContent className="py-6 text-center text-muted-foreground">
              <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>This topic is locked. No new replies can be added.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
