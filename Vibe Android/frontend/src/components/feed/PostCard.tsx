import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MoreHorizontal, Bookmark, Repeat2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Post, PostIntent } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import MentionHashtagText from '@/components/common/MentionHashtagText';
import RepostDialog from '@/components/feed/RepostDialog';
import CollectionDialog from '@/components/collections/CollectionDialog';
import IntentBadge from '@/components/post/IntentBadge';
import ExpiryBadge from '@/components/post/ExpiryBadge';
import AlgorithmBadge from '@/components/feed/AlgorithmBadge';
import TrustBadge, { TrustBadgeLevel } from '@/components/profile/TrustBadge';

interface PostCardProps {
  post: Post;
  onLikeToggle?: () => void;
  onSaveToggle?: () => void;
  onRepost?: () => void;
}

export default function PostCard({ post, onLikeToggle, onSaveToggle, onRepost }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(post.is_saved || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReposted, setIsReposted] = useState(post.is_reposted || false);
  const [repostsCount, setRepostsCount] = useState(post.reposts_count || 0);
  const [showRepostDialog, setShowRepostDialog] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }
    
    if (isLiking) return;
    setIsLiking(true);

    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      if (wasLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id);
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: user.id, post_id: post.id });
        
        if (post.user_id !== user.id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: post.user_id,
              type: 'like',
              actor_id: user.id,
              post_id: post.id,
            });
        }
      }
      onLikeToggle?.();
    } catch {
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save posts');
      return;
    }
    
    if (isSaving) return;
    setIsSaving(true);

    const wasSaved = isSaved;
    setIsSaved(!wasSaved);

    try {
      if (wasSaved) {
        await supabase
          .from('saved_posts')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id);
        toast.success('Removed from saved');
      } else {
        await supabase
          .from('saved_posts')
          .insert({ user_id: user.id, post_id: post.id });
        toast.success('Post saved');
      }
      onSaveToggle?.();
    } catch {
      setIsSaved(wasSaved);
      toast.error('Failed to update save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRepost = () => {
    if (!user) {
      toast.error('Please sign in to repost');
      return;
    }
    setShowRepostDialog(true);
  };

  const handleSaveWithCollection = () => {
    if (!user) {
      toast.error('Please sign in to save posts');
      return;
    }
    setShowCollectionDialog(true);
  };

  const initials = post.profile?.display_name
    ? post.profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : post.profile?.username?.slice(0, 2).toUpperCase() || 'U';

  return (
    <article className="floating-card overflow-hidden animate-fade-in-up">
      {/* Algorithm transparency - why you see this */}
      {post.feed_reason && !post.is_repost && (
        <div className="px-4 pt-3 pb-1">
          <AlgorithmBadge reason={post.feed_reason} />
        </div>
      )}

      {/* Repost indicator */}
      {post.is_repost && post.reposted_by && (
        <Link 
          to={`/user/${post.reposted_by.username}`}
          className="flex items-center gap-2 px-4 pt-3 pb-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Repeat2 className="w-3.5 h-3.5" />
          <span>
            <span className="font-medium">{post.reposted_by.display_name || post.reposted_by.username}</span> reposted
          </span>
        </Link>
      )}

      {/* Repost comment if any */}
      {post.is_repost && post.repost_comment && (
        <div className="px-4 pt-2 pb-2 border-b border-border/50">
          <MentionHashtagText text={post.repost_comment} className="text-sm italic text-muted-foreground" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link to={`/user/${post.profile?.username}`} className="flex items-center gap-3 group">
          <Avatar className="w-11 h-11 ring-2 ring-primary/20 transition-transform group-hover:scale-105">
            <AvatarImage src={post.profile?.avatar_url || undefined} />
            <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                {post.profile?.display_name || post.profile?.username}
              </p>
              {(post.profile as any)?.trust_badge && (post.profile as any).trust_badge !== 'none' && (
                <TrustBadge level={(post.profile as any).trust_badge as TrustBadgeLevel} size="sm" />
              )}
              {post.intent && <IntentBadge intent={post.intent as PostIntent} />}
              {post.expires_at && <ExpiryBadge expiresAt={post.expires_at} />}
            </div>
            <p className="text-xs text-muted-foreground">
              @{post.profile?.username} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <MentionHashtagText text={post.content} className="text-sm whitespace-pre-wrap leading-relaxed" />
        </div>
      )}

      {/* Media */}
      {post.media_url && (
        <div className="aspect-square bg-secondary/30 overflow-hidden mx-4 rounded-xl">
          {post.media_type === 'video' ? (
            <video
              src={post.media_url}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={post.media_url}
              alt="Post media"
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              loading="lazy"
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all",
              isLiked 
                ? "bg-destructive/10 text-destructive" 
                : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
            disabled={isLiking}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-all',
                isLiked && 'fill-current animate-pulse-heart'
              )}
            />
            <span className="text-sm font-medium">
              {likesCount > 0 && likesCount}
            </span>
          </button>

          <Link 
            to={`/post/${post.id}`} 
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {post.comments_count || ''}
            </span>
          </Link>

          <button 
            onClick={handleRepost} 
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all",
              isReposted 
                ? "bg-success/10 text-success" 
                : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <Repeat2 className={cn("w-5 h-5", isReposted && "fill-current")} />
            <span className="text-sm font-medium">
              {repostsCount > 0 && repostsCount}
            </span>
          </button>
        </div>

        <button
          onClick={handleSaveWithCollection}
          disabled={isSaving}
          className={cn(
            "p-2 rounded-xl transition-all",
            isSaved
              ? "bg-primary/10 text-primary"
              : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <Bookmark
            className={cn(
              'w-5 h-5 transition-all',
              isSaved && 'fill-current'
            )}
          />
        </button>
      </div>

      {/* Dialogs */}
      <RepostDialog
        post={post}
        open={showRepostDialog}
        onOpenChange={setShowRepostDialog}
        onRepostSuccess={() => {
          setIsReposted(true);
          setRepostsCount(prev => prev + 1);
          onRepost?.();
        }}
      />
      
      <CollectionDialog
        postId={post.id}
        open={showCollectionDialog}
        onOpenChange={setShowCollectionDialog}
        onSaveSuccess={() => {
          setIsSaved(true);
          onSaveToggle?.();
        }}
      />
    </article>
  );
}