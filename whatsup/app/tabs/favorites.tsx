import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PropertyCard from '@/components/PropertyCard';
import Colors from '@/constants/colors';
import { MOCK_PROPERTIES } from '@/mocks/properties';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>(['p1', 'p3']);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const saved = MOCK_PROPERTIES.filter(p => favorites.includes(p.id));

  return (
    <View style={styles.container}>
      <FlatList
        data={saved}
        keyExtractor={p => p.id}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            isFavorite
            onToggleFavorite={toggleFavorite}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.count}>{saved.length} saved properties</Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyTitle}>No saved properties yet</Text>
            <Text style={styles.emptySubtitle}>Tap the heart on any listing to save it here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  list: { padding: 16 },
  count: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', marginBottom: 12 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 },
});
