import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMessageStore } from '../../stores/messageStore';
import { useAuthStore } from '../../stores/authStore';
import { Colors } from '../../constants/theme';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { messages, fetchMessages, sendMessage: sendMsg, addMessage } = useMessageStore();
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => { if (id) fetchMessages(id); }, [id]);

  const send = async () => {
    if (!text.trim()) return;
    const c = text.trim(); setText('');
    addMessage({ _id: Date.now().toString(), sender: { _id: user?._id, name: user?.name, avatar: user?.avatar }, content: c, createdAt: new Date().toISOString() });
    try { await sendMsg(id!, c); } catch {}
  };

  const renderMsg = ({ item }: any) => {
    const mine = item.sender?._id === user?._id;
    return (
      <View style={[s.row, mine && s.myRow]}>
        {!mine && <Image source={{ uri: item.sender?.avatar || 'https://ui-avatars.com/api/?name=U' }} style={s.av} />}
        <View style={[s.bubble, mine ? s.myB : s.theirB]}>
          <Text style={[s.msgTxt, mine && { color: '#fff' }]}>{item.content}</Text>
          <Text style={[s.time, mine && { color: 'rgba(255,255,255,0.7)' }]}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={s.c} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.hdr}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={Colors.black} /></TouchableOpacity>
        <Text style={s.hdrTxt}>Chat</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList ref={flatListRef} data={messages} renderItem={renderMsg} keyExtractor={(i) => i._id} contentContainerStyle={{ padding: 16 }} onContentSizeChange={() => flatListRef.current?.scrollToEnd()} />
      <View style={s.inputC}>
        <TextInput style={s.inp} placeholder="Type a message..." placeholderTextColor={Colors.gray} value={text} onChangeText={setText} multiline maxLength={2000} />
        <TouchableOpacity style={[s.sendBtn, !text.trim() && { backgroundColor: Colors.mediumGray }]} onPress={send} disabled={!text.trim()}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#fff' },
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  hdrTxt: { fontSize: 18, fontWeight: '600', color: '#222' },
  row: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  myRow: { justifyContent: 'flex-end' },
  av: { width: 32, height: 32, borderRadius: 16, marginRight: 8, backgroundColor: '#f5f5f5' },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 20 },
  myB: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  theirB: { backgroundColor: '#f5f5f5', borderBottomLeftRadius: 4 },
  msgTxt: { fontSize: 15, color: '#222', lineHeight: 20 },
  time: { fontSize: 11, color: '#999', marginTop: 4, alignSelf: 'flex-end' },
  inputC: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  inp: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100, color: '#222', marginRight: 8 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});
