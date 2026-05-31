import React, { useState, useCallback } from 'react';
import {
  FlatList, StyleSheet, View, TextInput, Pressable, Text, ActivityIndicator
} from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import ChatListItem from '@/components/ChatListItem';
import Colors from '@/constants/colors';
import { MOCK_CHATS } from '@/mocks/chats';
import { supabase } from '@/lib/supabase';
import { Chat } from '@/types/chat';

function buildChatFromSupabase(row: any): Chat {
  const participant = row.chat_participants?.[0];
  const profile = participant?.profiles;
  const lastMsg = Array.isArray(row.messages) ? row.messages[0] : null;

  return {
    id: row.id,
    user: {
      id: profile?.id || row.id,
      name: profile?.name || 'Unknown',
      phoneNumber: profile?.phone_number || '',
      avatar: profile?.avatar_url || `https://i.pravatar.cc/150?u=${row.id}`,
      isOnline: profile?.is_online || false,
    },
    messages: [],
    lastMessage: lastMsg ? {
      id: lastMsg.id,
      text: lastMsg.text || '',
      timestamp: new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderId: lastMsg.sender_id,
      isRead: lastMsg.is_read,
      type: 'text',
    } : undefined,
    unreadCount: 0,
  };
}

export default function ChatsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [loading, setLoading] = useState(false);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          id,
          updated_at,
          chat_participants(profiles(id, name, phone_number, avatar_url, is_online)),
          messages!last_message_id(id, text, timestamp, sender_id, is_read)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Merge Supabase chats on top of mock chats
        const supabaseChats = data.map(buildChatFromSupabase);
        setChats([...supabaseChats, ...MOCK_CHATS]);
      }
    } catch (err) {
      // Supabase not yet set up — fall back to mock data silently
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch every time this screen comes into focus (including after adding a contact)
  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [fetchChats])
  );

  const filtered = chats.filter(c => {
    const name = c.isGroup ? (c.groupName || '') : c.user.name;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const pinned = filtered.filter(c => c.isPinned);
  const rest = filtered.filter(c => !c.isPinned);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading && chats.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
      ) : (
        <FlatList
          data={[...pinned, ...rest]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem chat={item} currentUserId="currentUser" />
          )}
          ListHeaderComponent={
            pinned.length > 0 ? (
              <Text style={styles.sectionLabel}>PINNED</Text>
            ) : null
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 80 }}
          onRefresh={fetchChats}
          refreshing={loading}
        />
      )}

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => router.push('/add-contact')}>
        <Plus size={26} color={Colors.textLight} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: {
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: Colors.background,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.backgroundSecondary, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: Colors.textTertiary,
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    marginLeft: 80,
  },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 8,
  },
});