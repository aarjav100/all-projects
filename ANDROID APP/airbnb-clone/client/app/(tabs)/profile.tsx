import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Image, Alert, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { Colors, BorderRadius, Shadows } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => {
        logout();
        router.replace('/(auth)/login');
      }},
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginTitle}>Log in to manage your account</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const menuSections = [
    {
      title: 'Settings',
      items: [
        { icon: 'person-outline', label: 'Personal information', onPress: () => {} },
        { icon: 'shield-checkmark-outline', label: 'Login & security', onPress: () => {} },
        { icon: 'card-outline', label: 'Payments & payouts', onPress: () => {} },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
        { icon: 'lock-closed-outline', label: 'Privacy & sharing', onPress: () => {} },
      ],
    },
    {
      title: 'Hosting',
      items: [
        { icon: 'home-outline', label: 'Switch to hosting', onPress: () => router.push('/host/create') },
        { icon: 'list-outline', label: 'Manage listings', onPress: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Get help', onPress: () => {} },
        { icon: 'chatbox-outline', label: 'Give feedback', onPress: () => {} },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Profile</Text>

      {/* User Card */}
      <TouchableOpacity style={styles.userCard}>
        <Image
          source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=U' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userRole}>
            {user?.role === 'host' ? '🏠 Host' : '🌍 Guest'} · Joined {new Date(user?.createdAt || '').getFullYear()}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
      </TouchableOpacity>

      {/* Menu Sections */}
      {menuSections.map((section, i) => (
        <View key={i} style={styles.menuSection}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, j) => (
            <TouchableOpacity key={j} style={styles.menuItem} onPress={item.onPress}>
              <Ionicons name={item.icon as any} size={24} color={Colors.darkGray} />
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  title: {
    fontSize: 28, fontWeight: '700', color: Colors.black,
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingBottom: 16,
  },
  loginPrompt: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  loginTitle: { fontSize: 18, fontWeight: '600', color: Colors.black, textAlign: 'center', marginBottom: 20 },
  loginButton: {
    paddingHorizontal: 32, paddingVertical: 14,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
  },
  loginButtonText: { fontSize: 16, fontWeight: '600', color: Colors.white },
  userCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, padding: 16, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white, ...Shadows.medium,
    marginBottom: 24,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16, backgroundColor: Colors.lightGray },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: '600', color: Colors.black },
  userEmail: { fontSize: 14, color: Colors.gray, marginTop: 2 },
  userRole: { fontSize: 13, color: Colors.darkGray, marginTop: 4 },
  menuSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13, fontWeight: '600', color: Colors.gray,
    paddingHorizontal: 24, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  menuItemText: { flex: 1, fontSize: 16, color: Colors.darkGray, marginLeft: 16 },
  logoutButton: {
    marginHorizontal: 24, marginTop: 16, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: Colors.lightGray,
  },
  logoutText: { fontSize: 16, fontWeight: '500', color: Colors.error, textDecorationLine: 'underline' },
  versionText: { fontSize: 12, color: Colors.gray, textAlign: 'center', paddingVertical: 24 },
});
