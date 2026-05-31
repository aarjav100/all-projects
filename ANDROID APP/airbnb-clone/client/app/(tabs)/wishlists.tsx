import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  Image, RefreshControl, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { userService } from '../../services';
import { Colors, BorderRadius, Shadows, Spacing } from '../../constants/theme';

export default function WishlistsScreen() {
  const { user, isAuthenticated } = useAuthStore();
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlists = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      const { data } = await userService.getWishlists();
      setWishlists(data.data);
    } catch {
      // Silent
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  const createWishlist = () => {
    Alert.prompt('New Wishlist', 'Enter a name for your wishlist', async (name) => {
      if (name?.trim()) {
        try {
          const { data } = await userService.createWishlist(name.trim());
          setWishlists(data.data);
        } catch { }
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color={Colors.mediumGray} />
        <Text style={styles.emptyTitle}>Log in to view wishlists</Text>
        <Text style={styles.emptySubtitle}>Save your favorite places for your next trip</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlists</Text>
        <TouchableOpacity onPress={createWishlist}>
          <Ionicons name="add" size={28} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {wishlists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={Colors.mediumGray} />
          <Text style={styles.emptyTitle}>Create your first wishlist</Text>
          <Text style={styles.emptySubtitle}>
            As you search, tap the heart icon to save your favorite places.
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={createWishlist}>
            <Text style={styles.createButtonText}>Create a wishlist</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlists}
          numColumns={2}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchWishlists} tintColor={Colors.primary} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.wishlistCard}>
              <View style={styles.wishlistImageContainer}>
                {item.listings?.[0]?.images?.[0] ? (
                  <Image source={{ uri: item.listings[0].images[0] }} style={styles.wishlistImage} />
                ) : (
                  <View style={[styles.wishlistImage, styles.emptyImage]}>
                    <Ionicons name="image-outline" size={32} color={Colors.mediumGray} />
                  </View>
                )}
              </View>
              <Text style={styles.wishlistName}>{item.name}</Text>
              <Text style={styles.wishlistCount}>{item.listings?.length || 0} saved</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.black },
  grid: { paddingHorizontal: 24 },
  gridRow: { justifyContent: 'space-between' },
  wishlistCard: { width: '48%', marginBottom: 24 },
  wishlistImageContainer: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadows.small },
  wishlistImage: { width: '100%', aspectRatio: 1, backgroundColor: Colors.lightGray },
  emptyImage: { justifyContent: 'center', alignItems: 'center' },
  wishlistName: { fontSize: 16, fontWeight: '600', color: Colors.black, marginTop: 8 },
  wishlistCount: { fontSize: 14, color: Colors.gray },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: Colors.black, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: Colors.gray, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  createButton: {
    marginTop: 24, paddingHorizontal: 24, paddingVertical: 14,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
  },
  createButtonText: { fontSize: 16, fontWeight: '600', color: Colors.white },
});
