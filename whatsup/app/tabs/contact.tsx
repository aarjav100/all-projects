import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { Phone, Video, PhoneIncoming, PhoneMissed, PhoneOutgoing } from 'lucide-react-native';
import Colors from '@/constants/colors';

const MOCK_CALLS = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=u1', type: 'incoming', time: 'Today, 10:30 AM', duration: '5:12', isVideo: false },
  { id: '2', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?u=u3', type: 'missed', time: 'Today, 8:45 AM', duration: null, isVideo: true },
  { id: '3', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=u2', type: 'outgoing', time: 'Yesterday, 9:00 PM', duration: '2:38', isVideo: false },
  { id: '4', name: 'Rahul Kumar', avatar: 'https://i.pravatar.cc/150?u=u4', type: 'incoming', time: 'Monday, 6:15 PM', duration: '12:05', isVideo: false },
  { id: '5', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=u1', type: 'outgoing', time: 'Sunday, 3:30 PM', duration: '0:45', isVideo: true },
];

const CallIcon = ({ type }: { type: string }) => {
  if (type === 'incoming') return <PhoneIncoming size={14} color={Colors.success} />;
  if (type === 'missed') return <PhoneMissed size={14} color={Colors.error} />;
  return <PhoneOutgoing size={14} color={Colors.textTertiary} />;
};

export default function CallsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_CALLS}
        keyExtractor={c => c.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.callMeta}>
                <CallIcon type={item.type} />
                <Text style={[styles.callInfo, item.type === 'missed' && styles.missed]}>
                  {item.isVideo ? '📹 ' : ''}{item.time}
                </Text>
              </View>
            </View>
            {item.duration && <Text style={styles.duration}>{item.duration}</Text>}
            <Pressable style={styles.callBtn}>
              {item.isVideo ? <Video size={22} color={Colors.primary} /> : <Phone size={22} color={Colors.primary} />}
            </Pressable>
          </View>
        )}
        ListHeaderComponent={<Text style={styles.sectionLabel}>RECENT</Text>}
      />

      {/* FAB */}
      <Pressable style={styles.fab}>
        <Phone size={24} color={Colors.textLight} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: Colors.textTertiary, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  callMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  callInfo: { fontSize: 12, color: Colors.textSecondary },
  missed: { color: Colors.error },
  duration: { fontSize: 12, color: Colors.textTertiary, marginRight: 4 },
  callBtn: { padding: 8 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.divider, marginLeft: 76 },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6,
  },
});