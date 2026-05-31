import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Repeat2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Post } from '@/types/database';

interface RepostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepostSuccess?: () => void;
}

export default function RepostDialog({ post, open, onOpenChange, onRepostSuccess }: RepostDialogProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRepost = async () => {
    if (!user) {
      toast.error('Please sign in to repost');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('reposts')
        .insert({
          user_id: user.id,
          post_id: post.id,
          comment: comment.trim() || null,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('You already reposted this');
        } else {
          throw error;
        }
      } else {
        // Create notification for post owner
        if (post.user_id !== user.id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: post.user_id,
              type: 'repost',
              actor_id: user.id,
              post_id: post.id,
            });
        }
        toast.success('Reposted!');
        onRepostSuccess?.();
        onOpenChange(false);
        setComment('');
      }
    } catch (error) {
      console.error('Error reposting:', error);
      toast.error('Failed to repost');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickRepost = async () => {
    setComment('');
    await handleRepost();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat2 className="w-5 h-5 text-primary" />
            Repost
          </DialogTitle>
          <DialogDescription>
            Share this post with your followers
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Original post preview */}
          <div className="p-3 rounded-xl bg-secondary/30 border border-border">
            <p className="text-sm text-muted-foreground mb-1">
              @{post.profile?.username}
            </p>
            <p className="text-sm line-clamp-2">
              {post.content || (post.media_url ? '[Media]' : '')}
            </p>
          </div>

          {/* Add comment */}
          <Textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px] resize-none"
            maxLength={280}
          />
          <p className="text-xs text-muted-foreground text-right">{comment.length}/280</p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleQuickRepost}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Repeat2 className="w-4 h-4 mr-2" />}
              Quick Repost
            </Button>
            <Button
              onClick={handleRepost}
              disabled={isSubmitting}
              className="flex-1 gradient-primary text-primary-foreground"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Repost with Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
