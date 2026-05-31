import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Message, Profile } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Conversation {
  userId: string;
  profile: Profile;
  lastMessage: Message;
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        // Get all messages involving the user
        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (!messagesData || messagesData.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }

        // Group by conversation partner
        const conversationsMap = new Map<string, { lastMessage: Message; unreadCount: number }>();
        
        messagesData.forEach(msg => {
          const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          
          if (!conversationsMap.has(partnerId)) {
            conversationsMap.set(partnerId, {
              lastMessage: msg as Message,
              unreadCount: 0,
            });
          }
          
          // Count unread messages
          if (msg.receiver_id === user.id && !msg.read_at) {
            const conv = conversationsMap.get(partnerId)!;
            conv.unreadCount++;
          }
        });

        // Fetch profiles
        const partnerIds = Array.from(conversationsMap.keys());
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', partnerIds);

        const profilesMap = new Map<string, Profile>();
        profilesData?.forEach(p => profilesMap.set(p.user_id, p as Profile));

        // Build conversations list
        const convList: Conversation[] = [];
        conversationsMap.forEach((value, partnerId) => {
          const profile = profilesMap.get(partnerId);
          if (profile) {
            convList.push({
              userId: partnerId,
              profile,
              lastMessage: value.lastMessage,
              unreadCount: value.unreadCount,
            });
          }
        });

        // Sort by last message time
        convList.sort((a, b) => 
          new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
        );

        setConversations(convList);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <MainLayout hideNav>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideHeader hideNav>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border safe-area-top">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Messages</h1>
      </header>

      {conversations.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="font-semibold mb-2">No messages yet</h3>
          <p className="text-muted-foreground text-sm">
            Start a conversation by visiting someone's profile
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {conversations.map((conv) => {
            const initials = conv.profile.display_name
              ? conv.profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
              : conv.profile.username.slice(0, 2).toUpperCase();

            const isFromMe = conv.lastMessage.sender_id === user?.id;

            return (
              <Link
                key={conv.userId}
                to={`/messages/${conv.userId}`}
                className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={conv.profile.avatar_url || undefined} />
                    <AvatarFallback className="gradient-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <p className="font-semibold truncate">
                      {conv.profile.display_name || conv.profile.username}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {isFromMe && 'You: '}{conv.lastMessage.content}
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