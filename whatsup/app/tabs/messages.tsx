import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare } from 'lucide-react-native';
import Colors from '@/constants/colors';

const MOCK_CHATS = [
  { id: 'c1', name: 'Rahul Sharma', property: 'Luxury Sea-View Apartment', message: 'Is the property still available?', time: '10:30 AM', unread: 2, avatar: 'https://i.pravatar.cc/150?u=u10' },
  { id: 'c2', name: 'Priya Menon', property: 'Cozy Studio in Koramangala', message: 'I can schedule a visit on Sunday.', time: 'Yesterday', unread: 0, avatar: 'https://i.pravatar.cc/150?u=u11' },
  { id: 'c3', name: 'Sneha Iyer', property: 'Modern 2BHK in Bandra', message: 'The rent is negotiable.', time: 'Monday', unread: 1, avatar: 'https://i.pravatar.cc/150?u=u13' },
];

export default function MessagesScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof MOCK_CHATS[0] }) => (
    <Pressable style={styles.chatItem} onPress={() => router.push(`/chat/${item.id}`)}>
      <View style={styles.avatarWrapper}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
        <View style={styles.onlineDot} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.propertyLabel} numberOfLines={1}>🏠 {item.property}</Text>
        <View style={styles.chatFooter}>
          <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
          {item.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_CHATS}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MessageSquare size={56} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No conversations yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16 },
  chatItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  avatarWrapper: { position: 'relative' },
  avatarText: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary, color: Colors.textLight,
    fontSize: 20, fontWeight: '700', textAlign: 'center', lineHeight: 52,
  },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.online, borderWidth: 2, borderColor: Colors.background,
  },
  chatInfo: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  chatName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  chatTime: { fontSize: 12, color: Colors.textTertiary },
  propertyLabel: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginBottom: 3 },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatMessage: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  badge: {
    backgroundColor: Colors.primary, borderRadius: 10,
    minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5,
  },
  badgeText: { color: Colors.textLight, fontSize: 11, fontWeight: '700' },
  separator: { height: 1, backgroundColor: Colors.divider },
  empty: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
});
