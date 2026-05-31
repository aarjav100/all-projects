import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Image } from 'react-native';
import { 
  User, Bell, Lock, MessageSquare, HelpCircle, 
  ChevronRight, Moon, Star, RefreshCw, LogOut
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const SETTINGS = [
  { icon: User, label: 'Account', sub: 'Privacy, security, change number' },
  { icon: Bell, label: 'Notifications', sub: 'Message, group & call tones' },
  { icon: Lock, label: 'Privacy', sub: 'Block contacts, disappearing messages' },
  { icon: MessageSquare, label: 'Chats', sub: 'Theme, wallpapers, chat history' },
  { icon: Star, label: 'Starred Messages', sub: null },
  { icon: RefreshCw, label: 'Storage and Data', sub: 'Network usage, auto-download' },
  { icon: HelpCircle, label: 'Help', sub: 'Help Centre, contact us, privacy policy' },
];

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Row */}
      <Pressable style={styles.profileRow}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>Y</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>You</Text>
          <Text style={styles.profileAbout}>Hey there! I am using WhatsApp.</Text>
        </View>
        <View style={styles.qrBtn}>
          <Text style={{ fontSize: 18 }}>⊞</Text>
        </View>
      </Pressable>

      {/* Settings List */}
      <View style={styles.card}>
        {SETTINGS.map((item, i) => (
          <Pressable
            key={item.label}
            style={[styles.settingRow, i < SETTINGS.length - 1 && styles.settingBorder]}
          >
            <View style={styles.settingIcon}>
              <item.icon size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              {item.sub && <Text style={styles.settingSub} numberOfLines={1}>{item.sub}</Text>}
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </Pressable>
        ))}
      </View>

      {/* Version */}
      <Text style={styles.version}>WhatsApp from Meta</Text>
      <Text style={styles.versionNum}>Version 2.25.9.0</Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  profileRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.background, paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 8,
  },
  profileAvatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  profileAvatarText: { color: Colors.textLight, fontSize: 26, fontWeight: '700' },
  profileName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  profileAbout: { fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  qrBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center', alignItems: 'center',
  },
  card: { backgroundColor: Colors.background, marginBottom: 8 },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 13,
  },
  settingBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.divider },
  settingIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center', alignItems: 'center',
  },
  settingLabel: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  settingSub: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  version: { fontSize: 13, color: Colors.textTertiary, textAlign: 'center', marginTop: 12 },
  versionNum: { fontSize: 12, color: Colors.textTertiary, textAlign: 'center', marginTop: 2 },
});