import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ArrowLeft, Send, Users, Video, Phone, MoreVertical } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

interface GroupChatProps {
  groupChatId: string;
  onBack: () => void;
}

interface Message {
  id: string;
  user_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface GroupChatInfo {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
}

export default function GroupChat({ groupChatId, onBack }: GroupChatProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: chatInfo } = useQuery({
    queryKey: ["group-chat-info", groupChatId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_chats")
        .select("id, name, description, avatar_url")
        .eq("id", groupChatId)
        .single();
      if (error) throw error;
      return data as GroupChatInfo;
    },
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ["group-messages", groupChatId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_messages")
        .select(`
          id,
          user_id,
          content,
          media_url,
          media_type,
          created_at,
          profiles:user_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq("group_chat_id", groupChatId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as unknown as Message[];
    },
  });

  const { data: memberCount } = useQuery({
    queryKey: ["group-chat-member-count", groupChatId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("group_chat_members")
        .select("*", { count: "exact", head: true })
        .eq("group_chat_id", groupChatId);
      if (error) throw error;
      return count || 0;
    },
  });

  // Join chat if not a member
  const joinChat = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("group_chat_members")
        .insert({
          group_chat_id: groupChatId,
          user_id: user.id,
          role: "member",
        });
      if (error && !error.message.includes("duplicate")) throw error;
    },
  });

  useEffect(() => {
    if (user?.id) {
      joinChat.mutate();
    }
  }, [user?.id]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`group-messages-${groupChatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_chat_id=eq.${groupChatId}`,
        },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, display_name, avatar_url")
            .eq("user_id", payload.new.user_id)
            .single();

          const newMessage = {
            ...payload.new,
            profiles: profile,
          } as Message;

          queryClient.setQueryData(
            ["group-messages", groupChatId],
            (old: Message[] | undefined) => [...(old || []), newMessage]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupChatId, queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!user?.id || !message.trim()) throw new Error("Cannot send empty message");
      
      const { error } = await supabase
        .from("group_messages")
        .insert({
          group_chat_id: groupChatId,
          user_id: user.id,
          content: message.trim(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setMessage("");
      inputRef.current?.focus();
    },
    onError: (error) => {
      toast.error("Failed to send message");
      console.error(error);
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessage.mutate();
    }
  };

  const formatMessageDate = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return format(d, "h:mm a");
    if (isYesterday(d)) return `Yesterday ${format(d, "h:mm a")}`;
    return format(d, "MMM d, h:mm a");
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    msgs?.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages || []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={chatInfo?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {chatInfo?.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{chatInfo?.name}</h2>
          <p className="text-xs text-muted-foreground">{memberCount} members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading messages...</div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">Welcome to {chatInfo?.name}!</p>
              <p className="text-sm mt-1">Start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-6">
            {messageGroups.map((group) => (
              <div key={group.date}>
                <div className="flex justify-center mb-4">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {isToday(new Date(group.date))
                      ? "Today"
                      : isYesterday(new Date(group.date))
                      ? "Yesterday"
                      : format(new Date(group.date), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="space-y-3">
                  {group.messages.map((msg, idx) => {
                    const isOwn = msg.user_id === user?.id;
                    const showAvatar =
                      !isOwn &&
                      (idx === 0 ||
                        group.messages[idx - 1]?.user_id !== msg.user_id);

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                      >
                        {!isOwn && (
                          <div className="w-8">
                            {showAvatar && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.profiles?.avatar_url || undefined} />
                                <AvatarFallback className="text-xs">
                                  {(msg.profiles?.display_name || msg.profiles?.username)?.[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}
                        >
                          {showAvatar && !isOwn && (
                            <p className="text-xs text-muted-foreground mb-1 ml-1">
                              {msg.profiles?.display_name || msg.profiles?.username}
                            </p>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwn
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          </div>
                          <p
                            className={`text-[10px] text-muted-foreground mt-1 ${
                              isOwn ? "text-right mr-1" : "ml-1"
                            }`}
                          >
                            {formatMessageDate(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMessage.isPending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
