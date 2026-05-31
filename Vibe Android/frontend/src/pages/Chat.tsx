import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message, Profile } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import VideoCall from '@/components/calling/VideoCall';

export default function Chat() {
  const { partnerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  const [isFollowing, setIsFollowing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !partnerId) return;

      try {
        // Fetch partner profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', partnerId)
          .maybeSingle();

        if (!profileData) {
          navigate('/messages');
          return;
        }

        setPartner(profileData as Profile);

        // Fetch messages
        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        setMessages((messagesData as Message[]) || []);

        // Mark messages as read
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('sender_id', partnerId)
          .eq('receiver_id', user.id)
          .is('read_at', null);

        // Check if user follows partner
        if (user) {
          const { data: followData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', partnerId)
            .maybeSingle();
          
          setIsFollowing(!!followData);
        }
      } catch (error) {
        console.error('Error fetching chat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === user?.id && newMsg.receiver_id === partnerId) ||
            (newMsg.sender_id === partnerId && newMsg.receiver_id === user?.id)
          ) {
            setMessages(prev => [...prev, newMsg]);
            
            // Mark as read if from partner
            if (newMsg.sender_id === partnerId) {
              supabase
                .from('messages')
                .update({ read_at: new Date().toISOString() })
                .eq('id', newMsg.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, partnerId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!user || !partnerId || !newMessage.trim()) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: partnerId,
          content,
        });

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: partnerId,
          type: 'message',
          actor_id: user.id,
        });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday ' + format(date, 'h:mm a');
    }
    return format(date, 'MMM d, h:mm a');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!partner) return null;

  const initials = partner.display_name
    ? partner.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : partner.username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Video Call Overlay */}
      {isInCall && partner && (
        <VideoCall 
          partner={partner}
          callType={callType}
          onEnd={() => setIsInCall(false)} 
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border safe-area-top">
        <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={partner.avatar_url || undefined} />
          <AvatarFallback className="gradient-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{partner.display_name || partner.username}</p>
          <p className="text-xs text-muted-foreground">@{partner.username}</p>
        </div>
        
        {/* Call buttons - only show if following */}
        {isFollowing && (
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setCallType('audio');
                setIsInCall(true);
              }}
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setCallType('video');
                setIsInCall(true);
              }}
            >
              <Video className="w-5 h-5" />
            </Button>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.sender_id === user?.id;
            
            return (
              <div
                key={message.id}
                className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2',
                    isMe
                      ? 'gradient-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={cn(
                    'text-xs mt-1',
                    isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border p-4 safe-area-bottom">
        <div className="flex gap-2 max-w-lg mx-auto">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            size="icon"
            className="gradient-primary"
          >
            {sending ? (
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