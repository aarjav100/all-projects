import React, { useState, useRef } from 'react';
import {
  FlatList, StyleSheet, View, KeyboardAvoidingView,
  Platform, Pressable, Text, Alert, Modal, Image
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Video, Phone, MoreVertical, ArrowLeft } from 'lucide-react-native';
import MessageBubble from '@/components/MessageBubble';
import MessageInput from '@/components/MessageInput';
import Colors from '@/constants/colors';
import { Message } from '@/types/chat';
import { MOCK_CHATS } from '@/mocks/chats';

const REACTION_OPTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const flatRef = useRef<FlatList>(null);

  const chatData = MOCK_CHATS.find(c => c.id === id);
  const displayName = (name as string) || chatData?.groupName || chatData?.user.name || 'Chat';
  const isOnline = chatData?.user.isOnline;

  const [messages, setMessages] = useState<Message[]>(chatData?.messages || []);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [reactingTo, setReactingTo] = useState<Message | null>(null);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderId: 'currentUser',
      isRead: false,
      type: 'text',
      replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, senderName: replyTo.senderId === 'currentUser' ? 'You' : displayName } : undefined,
    };
    setMessages(prev => [...prev, newMessage]);
    setReplyTo(null);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handleReaction = (emoji: string) => {
    if (!reactingTo) return;
    setMessages(prev => prev.map(m =>
      m.id === reactingTo.id
        ? { ...m, reactions: [...(m.reactions || []), { emoji, userId: 'currentUser' }] }
        : m
    ));
    setReactingTo(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Custom Header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textLight} />
        </Pressable>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{displayName[0]}</Text>
          {isOnline && <View style={styles.onlineDot} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName} numberOfLines={1}>{displayName}</Text>
          <Text style={styles.headerSub}>{isOnline ? 'online' : chatData?.user.lastSeen || 'last seen recently'}</Text>
        </View>
        <Pressable style={styles.headerActions}>
          <Video size={20} color={Colors.textLight} />
        </Pressable>
        <Pressable style={styles.headerActions}>
          <Phone size={20} color={Colors.textLight} />
        </Pressable>
        <Pressable style={styles.headerActions}>
          <MoreVertical size={20} color={Colors.textLight} />
        </Pressable>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isFromCurrentUser={item.senderId === 'currentUser'}
            onLongPress={(m) => setReactingTo(m)}
            onReply={(m) => setReplyTo(m)}
          />
        )}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Text style={styles.emptyText}>🔒 Messages are end-to-end encrypted</Text>
          </View>
        }
      />

      {/* Reaction Picker Modal */}
      <Modal transparent visible={!!reactingTo} animationType="fade" onRequestClose={() => setReactingTo(null)}>
        <Pressable style={styles.reactionOverlay} onPress={() => setReactingTo(null)}>
          <View style={styles.reactionPicker}>
            {REACTION_OPTIONS.map(e => (
              <Pressable key={e} style={styles.reactionOption} onPress={() => handleReaction(e)}>
                <Text style={styles.reactionEmoji}>{e}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.replyOption} onPress={() => { setReplyTo(reactingTo!); setReactingTo(null); }}>
            <Text style={styles.replyOptionText}>↩ Reply</Text>
          </Pressable>
        </Pressable>
      </Modal>

      <MessageInput
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.chatBackground },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primaryDark || Colors.primary,
    paddingTop: 48, paddingBottom: 10, paddingHorizontal: 8, gap: 8,
  },
  backBtn: { padding: 6 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  headerAvatarText: { color: Colors.textLight, fontSize: 16, fontWeight: '700' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.online, borderWidth: 1.5, borderColor: Colors.primary },
  headerName: { fontSize: 16, fontWeight: '700', color: Colors.textLight },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  headerActions: { padding: 8 },
  listContent: { paddingVertical: 12 },
  emptyChat: { alignItems: 'center', marginTop: 30 },
  emptyText: { backgroundColor: 'rgba(0,0,0,0.12)', color: Colors.textSecondary, fontSize: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  reactionOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  reactionPicker: {
    flexDirection: 'row', backgroundColor: Colors.background,
    borderRadius: 32, paddingHorizontal: 12, paddingVertical: 8, gap: 4,
    shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 12,
  },
  reactionOption: { padding: 6 },
  reactionEmoji: { fontSize: 30 },
  replyOption: { marginTop: 12, backgroundColor: Colors.background, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  replyOptionText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
});