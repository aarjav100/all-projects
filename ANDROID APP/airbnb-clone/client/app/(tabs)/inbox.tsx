import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  Image, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMessageStore } from '../../stores/messageStore';
import { useAuthStore } from '../../stores/authStore';
import { Colors, BorderRadius, Shadows } from '../../constants/theme';

export default function InboxScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { conversations, isLoading, fetchConversations } = useMessageStore();

  useEffect(() => {
    if (isAuthenticated) fetchConversations();
  }, [isAuthenticated]);

  const getOtherParticipant = (participants: any[]) => {
    return participants?.find((p: any) => p._id !== user?._id) || participants?.[0];
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="chatbubble-outline" size={64} color={Colors.mediumGray} />
        <Text style={styles.emptyTitle}>Log in to see messages</Text>
        <Text style={styles.emptySubtitle}>Connect with hosts and guests</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color={Colors.mediumGray} />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>
            When you book a trip or connect with a host, your messages will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const other = getOtherParticipant(item.participants);
            const unread = item.unreadCount?.get?.(user?._id!) || 0;

            return (
              <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => router.push(`/chat/${item._id}`)}
              >
                <Image
                  source={{ uri: other?.avatar || 'https://ui-avatars.com/api/?name=U' }}
                  style={styles.avatar}
                />
                <View style={styles.conversationInfo}>
                  <View style={styles.conversationHeader}>
                    <Text style={[styles.conversationName, unread > 0 && styles.unreadName]}>
                      {other?.name || 'User'}
                    </Text>
                    <Text style={styles.conversationTime}>
                      {item.lastMessageAt ? formatTime(item.lastMessageAt) : ''}
                    </Text>
                  </View>
                  {item.listing && (
                    <Text style={styles.listingRef} numberOfLines={1}>
                      {item.listing.title}
                    </Text>
                  )}
                  <Text
                    style={[styles.lastMessage, unread > 0 && styles.unreadMessage]}
                    numberOfLines={1}
                  >
                    {item.lastMessage || 'Start a conversation'}
                  </Text>
                </View>
                {unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{unread}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  title: {
    fontSize: 28, fontWeight: '700', color: Colors.black,
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingBottom: 16,
  },
  conversationItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16, backgroundColor: Colors.lightGray },
  conversationInfo: { flex: 1 },
  conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  conversationName: { fontSize: 16, fontWeight: '500', color: Colors.black },
  unreadName: { fontWeight: '700' },
  conversationTime: { fontSize: 13, color: Colors.gray },
  listingRef: { fontSize: 13, color: Colors.gray, marginTop: 2 },
  lastMessage: { fontSize: 14, color: Colors.gray, marginTop: 4 },
  unreadMessage: { color: Colors.black, fontWeight: '500' },
  unreadBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8,
  },
  unreadCount: { fontSize: 12, fontWeight: '700', color: Colors.white },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: Colors.black, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: Colors.gray, textAlign: 'center', marginTop: 8 },
});
