import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, 
  Pressable, FlatList, Dimensions
} from 'react-native';
import { Plus, Camera } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MOCK_STATUSES } from '@/mocks/chats';

const { width } = Dimensions.get('window');

export default function StatusScreen() {
  const myStatus = null; // No status posted yet

  return (
    <ScrollView style={styles.container}>
      {/* My Status */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MY STATUS</Text>
        <Pressable style={styles.myStatusRow}>
          <View style={styles.myAvatarWrapper}>
            <View style={styles.myAvatar}>
              <Text style={styles.myAvatarText}>Y</Text>
            </View>
            <View style={styles.addBtn}>
              <Plus size={12} color={Colors.textLight} strokeWidth={3} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.myStatusTitle}>My Status</Text>
            <Text style={styles.myStatusSub}>Tap to add status update</Text>
          </View>
          <Pressable style={styles.cameraBtn}>
            <Camera size={20} color={Colors.primary} />
          </Pressable>
        </Pressable>
      </View>

      {/* Recent Updates */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>RECENT UPDATES</Text>
        {MOCK_STATUSES.map(status => (
          <Pressable key={status.id} style={styles.statusRow}>
            <View style={styles.statusAvatarRing}>
              {status.type === 'image' ? (
                <Image source={{ uri: status.user.avatar }} style={styles.statusAvatar} />
              ) : (
                <View style={[styles.statusAvatar, { backgroundColor: status.backgroundColor || Colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ color: Colors.textLight, fontSize: 18 }}>😊</Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.statusName}>{status.user.name}</Text>
              <Text style={styles.statusTime}>{status.timestamp}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Story-like dots (horizontal scroll preview) */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ALL UPDATES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {MOCK_STATUSES.filter(s => s.type === 'image').map(s => (
            <Pressable key={s.id} style={styles.storyThumb}>
              <Image source={{ uri: s.content }} style={styles.storyImage} />
              <Image source={{ uri: s.user.avatar }} style={styles.storyAvatarSmall} />
              <Text style={styles.storyName} numberOfLines={1}>{s.user.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  section: { marginBottom: 8 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: Colors.textTertiary, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.backgroundSecondary },
  myStatusRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 14 },
  myAvatarWrapper: { position: 'relative' },
  myAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  myAvatarText: { color: Colors.textLight, fontSize: 22, fontWeight: '700' },
  addBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.background,
  },
  myStatusTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  myStatusSub: { fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  cameraBtn: { padding: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  statusAvatarRing: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 2.5, borderColor: Colors.primary,
    padding: 2,
  },
  statusAvatar: { width: 46, height: 46, borderRadius: 23 },
  statusName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  statusTime: { fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  storyThumb: { width: 90, alignItems: 'center' },
  storyImage: { width: 80, height: 110, borderRadius: 12, borderWidth: 2.5, borderColor: Colors.primary },
  storyAvatarSmall: {
    width: 28, height: 28, borderRadius: 14,
    position: 'absolute', top: 6, left: 6,
    borderWidth: 1.5, borderColor: Colors.background,
  },
  storyName: { fontSize: 11, color: Colors.textSecondary, marginTop: 4, width: 80, textAlign: 'center' },
});