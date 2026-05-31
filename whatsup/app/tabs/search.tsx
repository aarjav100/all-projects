import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  Pressable, ScrollView
} from 'react-native';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react-native';
import PropertyCard from '@/components/PropertyCard';
import Colors from '@/constants/colors';
import { MOCK_PROPERTIES } from '@/mocks/properties';

const PRICE_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: '< ₹20k', min: 0, max: 20000 },
  { label: '₹20k-50k', min: 20000, max: 50000 },
  { label: '₹50k-1L', min: 50000, max: 100000 },
  { label: '> ₹1L', min: 100000, max: Infinity },
];
const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4+'];
const TYPES = ['Any', 'Apartment', 'Villa', 'Studio', 'House', 'Condo'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [priceRange, setPriceRange] = useState(0);
  const [bedrooms, setBedrooms] = useState('Any');
  const [type, setType] = useState('Any');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const results = useMemo(() => {
    const range = PRICE_RANGES[priceRange];
    return MOCK_PROPERTIES.filter(p => {
      const matchesQuery = query
        ? p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.location.city.toLowerCase().includes(query.toLowerCase()) ||
          p.location.address.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesPrice = p.price >= range.min && p.price <= range.max;
      const matchesBed = bedrooms === 'Any' || (bedrooms === '4+' ? p.bedrooms >= 4 : p.bedrooms === parseInt(bedrooms));
      const matchesType = type === 'Any' || p.type === type;
      return matchesQuery && matchesPrice && matchesBed && matchesType;
    });
  }, [query, priceRange, bedrooms, type]);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <SearchIcon size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="City, locality, property name..."
            placeholderTextColor={Colors.textTertiary}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <X size={16} color={Colors.textSecondary} />
            </Pressable>
          )}
        </View>
        <Pressable style={styles.filterBtn} onPress={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={20} color={showFilters ? Colors.textLight : Colors.primary} />
        </Pressable>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterLabel}>Price Range</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {PRICE_RANGES.map((r, i) => (
              <Pressable
                key={r.label}
                style={[styles.chip, priceRange === i && styles.chipActive]}
                onPress={() => setPriceRange(i)}
              >
                <Text style={[styles.chipText, priceRange === i && styles.chipTextActive]}>{r.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Bedrooms</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {BEDROOM_OPTIONS.map(b => (
              <Pressable
                key={b}
                style={[styles.chip, bedrooms === b && styles.chipActive]}
                onPress={() => setBedrooms(b)}
              >
                <Text style={[styles.chipText, bedrooms === b && styles.chipTextActive]}>{b}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Property Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {TYPES.map(t => (
              <Pressable
                key={t}
                style={[styles.chip, type === t && styles.chipActive]}
                onPress={() => setType(t)}
              >
                <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={p => p.id}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.resultCount}>{results.length} properties found</Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No properties match your filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  filterBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
  },
  filtersPanel: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  filterLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginTop: 10, marginBottom: 6 },
  chipRow: { marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.backgroundTertiary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Colors.textLight },
  list: { padding: 16 },
  resultCount: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
});
