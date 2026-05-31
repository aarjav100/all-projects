import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Mail, AtSign, Repeat2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/layout/MainLayout';
import { Notification, Profile } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  message: Mail,
  mention: AtSign,
  repost: Repeat2,
};

const notificationMessages = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
  message: 'sent you a message',
  mention: 'mentioned you in a post',
  repost: 'reposted your post',
};

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!notificationsData || notificationsData.length === 0) {
          setNotifications([]);
          return;
        }

        const actorIds = [...new Set(notificationsData.map(n => n.actor_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', actorIds);

        const profilesMap = new Map<string, Profile>();
        profilesData?.forEach(p => profilesMap.set(p.user_id, p as Profile));

        const enrichedNotifications: Notification[] = notificationsData.map(n => ({
          ...n,
          type: n.type as 'like' | 'comment' | 'follow' | 'message' | 'mention' | 'repost',
          actor_profile: profilesMap.get(n.actor_id),
        }));

        setNotifications(enrichedNotifications);

        // Mark as read
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .eq('read', false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-4 py-4 border-b border-border">
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No notifications yet</h3>
          <p className="text-muted-foreground text-sm">
            When someone interacts with you, you'll see it here
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type];
            const message = notificationMessages[notification.type];
            const actor = notification.actor_profile;
            
            const initials = actor?.display_name
              ? actor.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
              : actor?.username?.slice(0, 2).toUpperCase() || 'U';

            const linkTo = notification.type === 'follow'
              ? `/user/${actor?.username}`
              : notification.type === 'message'
              ? `/messages/${actor?.user_id}`
              : `/post/${notification.post_id}`;

            return (
              <Link
                key={notification.id}
                to={linkTo}
                className={cn(
                  'flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors',
                  !notification.read && 'bg-primary/5'
                )}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={actor?.avatar_url || undefined} />
                    <AvatarFallback className="gradient-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center',
                    notification.type === 'like' && 'bg-destructive',
                    notification.type === 'comment' && 'bg-primary',
                    notification.type === 'follow' && 'bg-success',
                    notification.type === 'message' && 'bg-accent',
                    notification.type === 'mention' && 'bg-warning',
                    notification.type === 'repost' && 'bg-info'
                  )}>
                    <Icon className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{actor?.display_name || actor?.username}</span>
                    {' '}{message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}