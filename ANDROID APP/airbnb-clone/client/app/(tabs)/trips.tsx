import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  Image, RefreshControl, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../stores/bookingStore';
import { useAuthStore } from '../../stores/authStore';
import { Colors, BorderRadius, Shadows } from '../../constants/theme';

export default function TripsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { guestBookings, isLoading, fetchGuestBookings } = useBookingStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  useEffect(() => {
    if (isAuthenticated) fetchGuestBookings();
  }, [isAuthenticated]);

  const filteredBookings = guestBookings.filter((b) => {
    if (activeTab === 'upcoming') return ['pending', 'confirmed'].includes(b.status);
    if (activeTab === 'past') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return Colors.success;
      case 'pending': return Colors.warning;
      case 'cancelled': return Colors.error;
      case 'completed': return Colors.secondary;
      default: return Colors.gray;
    }
  };

  const getDaysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="airplane-outline" size={64} color={Colors.mediumGray} />
        <Text style={styles.emptyTitle}>Log in to see your trips</Text>
        <Text style={styles.emptySubtitle}>Plan your next adventure</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trips</Text>

      <View style={styles.tabs}>
        {(['upcoming', 'past', 'cancelled'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredBookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={Colors.mediumGray} />
          <Text style={styles.emptyTitle}>No {activeTab} trips</Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'upcoming' ? 'Time to start exploring!' : `You have no ${activeTab} trips`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={() => fetchGuestBookings()} tintColor={Colors.primary} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookingCard}
              onPress={() => router.push(`/booking/${item._id}`)}
            >
              <Image
                source={{ uri: item.listing?.images?.[0] || 'https://via.placeholder.com/400x300' }}
                style={styles.bookingImage}
              />
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle} numberOfLines={1}>{item.listing?.title}</Text>
                <Text style={styles.bookingLocation}>
                  {item.listing?.location?.city}, {item.listing?.location?.country}
                </Text>
                <Text style={styles.bookingDates}>
                  {new Date(item.checkIn).toLocaleDateString()} → {new Date(item.checkOut).toLocaleDateString()}
                </Text>
                <View style={styles.bookingFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                  </View>
                  {activeTab === 'upcoming' && (
                    <Text style={styles.countdown}>{getDaysUntil(item.checkIn)}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
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
  tabs: {
    flexDirection: 'row', paddingHorizontal: 24,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  tab: { paddingVertical: 12, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: Colors.black },
  tabText: { fontSize: 15, color: Colors.gray, fontWeight: '500' },
  activeTabText: { color: Colors.black, fontWeight: '600' },
  listContent: { padding: 24 },
  bookingCard: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg, marginBottom: 16,
    ...Shadows.small, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.lightGray,
  },
  bookingImage: { width: 120, height: 120 },
  bookingInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  bookingTitle: { fontSize: 16, fontWeight: '600', color: Colors.black },
  bookingLocation: { fontSize: 13, color: Colors.gray },
  bookingDates: { fontSize: 13, color: Colors.darkGray },
  bookingFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm },
  statusText: { fontSize: 12, fontWeight: '600' },
  countdown: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: Colors.black, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: Colors.gray, textAlign: 'center', marginTop: 8 },
});
