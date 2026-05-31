import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  LogOut, Heart, Home, Star, Settings, 
  ChevronRight, Phone, Mail, Shield
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

const MENU_ITEMS = [
  { icon: Home, label: 'My Listings', count: 2 },
  { icon: Heart, label: 'Saved Properties', count: 4 },
  { icon: Star, label: 'My Reviews', count: null },
  { icon: Shield, label: 'Privacy & Security', count: null },
  { icon: Settings, label: 'Settings', count: null },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={Colors.primaryGradient} style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <Text style={styles.name}>Aarjav Jain</Text>
        <Text style={styles.subtitle}>Member since March 2026</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>4</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>4.7</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Contact Details */}
      <View style={styles.card}>
        <View style={styles.contactRow}>
          <Phone size={16} color={Colors.primary} />
          <Text style={styles.contactText}>+91 75998 63191</Text>
        </View>
        <View style={styles.contactRow}>
          <Mail size={16} color={Colors.primary} />
          <Text style={styles.contactText}>aarjav@example.com</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.card}>
        {MENU_ITEMS.map((item, index) => (
          <Pressable key={item.label} style={[styles.menuRow, index < MENU_ITEMS.length - 1 && styles.menuBorder]}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <item.icon size={18} color={Colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <View style={styles.menuRight}>
              {item.count !== null && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{item.count}</Text>
                </View>
              )}
              <ChevronRight size={18} color={Colors.textTertiary} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* List Property CTA */}
      <Pressable style={styles.listCta} onPress={() => router.push('/add-property')}>
        <LinearGradient colors={Colors.secondaryGradient} style={styles.listCtaGradient}>
          <Text style={styles.listCtaText}>🏠  List Your Property</Text>
        </LinearGradient>
      </Pressable>

      {/* Logout */}
      <Pressable style={styles.logoutBtn}>
        <LogOut size={18} color={Colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 28, paddingHorizontal: 20 },
  avatarCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: Colors.textLight },
  name: { fontSize: 22, fontWeight: '800', color: Colors.textLight },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4, marginBottom: 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: Colors.textLight },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16, marginHorizontal: 16, marginTop: 16,
    paddingVertical: 6,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  contactText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countBadge: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { color: Colors.textLight, fontSize: 11, fontWeight: '700' },
  listCta: { marginHorizontal: 16, marginTop: 16, borderRadius: 14, overflow: 'hidden' },
  listCtaGradient: { paddingVertical: 16, alignItems: 'center' },
  listCtaText: { color: Colors.textLight, fontSize: 16, fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 16, paddingVertical: 14,
  },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '600' },
});
