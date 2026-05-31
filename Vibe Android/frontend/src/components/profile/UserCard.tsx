import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UserCardProps {
  profile: Profile;
  isFollowing?: boolean;
  onFollowChange?: () => void;
}

export default function UserCard({ profile, isFollowing: initialIsFollowing = false, onFollowChange }: UserCardProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const initials = profile.display_name
    ? profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.username.slice(0, 2).toUpperCase();

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please sign in to follow users');
      return;
    }

    if (user.id === profile.user_id) return;

    setIsLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);

    try {
      if (wasFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.user_id);
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: profile.user_id });

        // Create notification
        await supabase
          .from('notifications')
          .insert({
            user_id: profile.user_id,
            type: 'follow',
            actor_id: user.id,
          });
      }
      onFollowChange?.();
    } catch {
      setIsFollowing(wasFollowing);
      toast.error('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  const isOwnProfile = user?.id === profile.user_id;

  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
      <Link to={`/user/${profile.username}`} className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="w-12 h-12 ring-2 ring-primary/20">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-semibold truncate">{profile.display_name || profile.username}</p>
          <p className="text-sm text-muted-foreground truncate">@{profile.username}</p>
        </div>
      </Link>

      {!isOwnProfile && (
        <Button
          onClick={handleFollow}
          disabled={isLoading}
          variant={isFollowing ? 'outline' : 'default'}
          size="sm"
          className={!isFollowing ? 'gradient-primary text-primary-foreground' : ''}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </div>
  );
}