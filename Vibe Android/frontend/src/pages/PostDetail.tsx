import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostCard from '@/components/feed/PostCard';
import HashtagText from '@/components/common/HashtagText';
import { Post, Comment, Profile } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function PostDetail() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    if (!postId) return;

    try {
      // Fetch post
      const { data: postData } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .maybeSingle();

      if (!postData) {
        navigate('/');
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', postData.user_id)
        .maybeSingle();

      // Fetch likes count
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      // Fetch comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      // Check if user liked
      let isLiked = false;
      if (user) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', postId)
          .maybeSingle();
        isLiked = !!likeData;
      }

      setPost({
        ...postData,
        media_type: postData.media_type as 'image' | 'video' | null,
        profile: profileData as Profile,
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
        is_liked: isLiked,
      });

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map(c => c.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', userIds);

        const profilesMap = new Map<string, Profile>();
        profilesData?.forEach(p => profilesMap.set(p.user_id, p as Profile));

        const enrichedComments: Comment[] = commentsData.map(c => ({
          ...c,
          profile: profilesMap.get(c.user_id),
        }));

        setComments(enrichedComments);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId, user]);

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim() || !post) return;

    setSubmitting(true);

    try {
      const { data: commentData, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          post_id: post.id,
          content: newComment.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification
      if (post.user_id !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: post.user_id,
            type: 'comment',
            actor_id: user.id,
            post_id: post.id,
          });
      }

      // Fetch user profile for the new comment
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const newCommentWithProfile: Comment = {
        ...commentData,
        profile: profileData as Profile,
      };

      setComments(prev => [...prev, newCommentWithProfile]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border safe-area-top">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold">Post</h1>
      </header>

      {/* Post */}
      <PostCard post={post} onLikeToggle={fetchPost} />

      {/* Comments */}
      <div className="border-t border-border">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold">Comments ({comments.length})</h2>
        </div>

        {comments.length > 0 ? (
          <div className="divide-y divide-border">
            {comments.map((comment) => {
              const initials = comment.profile?.display_name
                ? comment.profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
                : comment.profile?.username?.slice(0, 2).toUpperCase() || 'U';

              return (
                <div key={comment.id} className="p-4 flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.profile?.avatar_url || undefined} />
                    <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">
                        {comment.profile?.display_name || comment.profile?.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <HashtagText text={comment.content} className="text-sm mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-4 safe-area-bottom">
        <div className="flex gap-2 max-w-lg mx-auto">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmitComment()}
            className="flex-1"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            size="icon"
            className="gradient-primary"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}