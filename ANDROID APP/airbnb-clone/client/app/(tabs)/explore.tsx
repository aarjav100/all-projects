import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, Image, ScrollView, RefreshControl, Dimensions,
  ActivityIndicator, Modal, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useListingStore } from '../../stores/listingStore';
import { Colors, BorderRadius, Spacing, Shadows, Categories } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function ExploreScreen() {
  const router = useRouter();
  const {
    listings, isLoading, pagination,
    selectedCategory, searchQuery,
    fetchListings, fetchMore, setCategory, setSearchQuery,
  } = useListingStore();
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchListings();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  }, []);

  const handleSearch = () => {
    fetchListings();
  };

  const renderCategoryPill = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.categoryPill, selectedCategory === item.key && styles.categoryPillActive]}
      onPress={() => setCategory(item.key)}
    >
      <Ionicons
        name={item.icon as any}
        size={22}
        color={selectedCategory === item.key ? Colors.black : Colors.gray}
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.key && styles.categoryTextActive,
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderListing = ({ item }: any) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => router.push(`/listing/${item._id}`)}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/800x600' }}
          style={styles.listingImage}
          resizeMode="cover"
        />
        {item.isSuperhost && (
          <View style={styles.superhostBadge}>
            <Text style={styles.superhostText}>Superhost</Text>
          </View>
        )}
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.listingInfo}>
        <View style={styles.listingHeader}>
          <Text style={styles.listingLocation} numberOfLines={1}>
            {item.location?.city}, {item.location?.country}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={Colors.black} />
            <Text style={styles.ratingText}>{item.averageRating?.toFixed(1) || 'New'}</Text>
          </View>
        </View>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingType}>{item.type} · {item.bedrooms} bed{item.bedrooms !== 1 ? 's' : ''}</Text>
        <Text style={styles.listingPrice}>
          <Text style={styles.priceAmount}>${item.pricePerNight}</Text> / night
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.black} />
          <View style={styles.searchTextContainer}>
            <Text style={styles.searchTitle}>Where to?</Text>
            <Text style={styles.searchSubtitle}>Anywhere · Any week · Add guests</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={20} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <FlatList
        data={Categories}
        renderItem={renderCategoryPill}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        keyExtractor={(item) => item.key}
      />

      {/* Listings */}
      {isLoading && listings.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding amazing places...</Text>
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={Colors.mediumGray} />
          <Text style={styles.emptyTitle}>No listings found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListing}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listingsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          onEndReached={fetchMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            pagination.hasMore ? (
              <ActivityIndicator size="small" color={Colors.primary} style={{ padding: 20 }} />
            ) : null
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => { setShowFilters(false); fetchListings(); }}>
              <Text style={styles.modalAction}>Apply</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.priceInputRow}>
              <View style={styles.priceInputContainer}>
                <Text style={styles.priceLabel}>Min</Text>
                <TextInput style={styles.priceInput} placeholder="$0" keyboardType="numeric" />
              </View>
              <Text style={styles.priceDash}>—</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.priceLabel}>Max</Text>
                <TextInput style={styles.priceInput} placeholder="$1000+" keyboardType="numeric" />
              </View>
            </View>

            <Text style={styles.filterSectionTitle}>Property Type</Text>
            <View style={styles.typeGrid}>
              {['House', 'Apartment', 'Cabin', 'Villa', 'Cottage', 'Castle'].map((type) => (
                <TouchableOpacity key={type} style={styles.typeChip}>
                  <Text style={styles.typeChipText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Rooms and Beds</Text>
            {['Bedrooms', 'Beds', 'Bathrooms'].map((label) => (
              <View key={label} style={styles.counterRow}>
                <Text style={styles.counterLabel}>{label}</Text>
                <View style={styles.counterControls}>
                  <TouchableOpacity style={styles.counterButton}>
                    <Ionicons name="remove" size={20} color={Colors.gray} />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>Any</Text>
                  <TouchableOpacity style={styles.counterButton}>
                    <Ionicons name="add" size={20} color={Colors.gray} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  searchHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 12, gap: 12,
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.full,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: Colors.mediumGray,
    ...Shadows.medium,
  },
  searchTextContainer: { marginLeft: 12, flex: 1 },
  searchTitle: { fontSize: 14, fontWeight: '600', color: Colors.black },
  searchSubtitle: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  filterButton: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1, borderColor: Colors.mediumGray,
    justifyContent: 'center', alignItems: 'center',
  },
  categoriesContainer: { paddingHorizontal: 24, paddingVertical: 12, gap: 16 },
  categoryPill: {
    alignItems: 'center', paddingBottom: 8,
    borderBottomWidth: 2, borderBottomColor: 'transparent', marginRight: 16,
  },
  categoryPillActive: { borderBottomColor: Colors.black },
  categoryText: { fontSize: 11, color: Colors.gray, marginTop: 4, fontWeight: '500' },
  categoryTextActive: { color: Colors.black, fontWeight: '600' },
  listingsContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  listingCard: { marginBottom: 24 },
  imageContainer: { position: 'relative', borderRadius: BorderRadius.lg, overflow: 'hidden' },
  listingImage: { width: CARD_WIDTH, height: CARD_WIDTH * 0.65, backgroundColor: Colors.lightGray },
  superhostBadge: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: Colors.white, borderRadius: BorderRadius.sm,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  superhostText: { fontSize: 12, fontWeight: '600', color: Colors.black },
  heartButton: {
    position: 'absolute', top: 12, right: 12,
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  listingInfo: { paddingTop: 10 },
  listingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listingLocation: { fontSize: 15, fontWeight: '600', color: Colors.black, flex: 1, marginRight: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '500', color: Colors.black },
  listingTitle: { fontSize: 14, color: Colors.gray, marginTop: 2 },
  listingType: { fontSize: 14, color: Colors.gray, marginTop: 1 },
  listingPrice: { fontSize: 15, color: Colors.black, marginTop: 6 },
  priceAmount: { fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: Colors.gray, marginTop: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: Colors.black, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: Colors.gray, marginTop: 8, textAlign: 'center' },
  // Filter Modal
  modalContainer: { flex: 1, backgroundColor: Colors.white },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.mediumGray,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: Colors.black },
  modalAction: { fontSize: 16, fontWeight: '600', color: Colors.primary },
  modalContent: { paddingHorizontal: 24, paddingTop: 24 },
  filterSectionTitle: { fontSize: 20, fontWeight: '600', color: Colors.black, marginBottom: 16, marginTop: 16 },
  priceInputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  priceInputContainer: { flex: 1 },
  priceLabel: { fontSize: 12, color: Colors.gray, marginBottom: 4 },
  priceInput: {
    borderWidth: 1, borderColor: Colors.mediumGray, borderRadius: BorderRadius.md,
    height: 48, paddingHorizontal: 16, fontSize: 16,
  },
  priceDash: { fontSize: 20, color: Colors.gray },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.mediumGray,
  },
  typeChipText: { fontSize: 14, color: Colors.darkGray },
  counterRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  counterLabel: { fontSize: 16, color: Colors.black },
  counterControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterButton: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.mediumGray,
    justifyContent: 'center', alignItems: 'center',
  },
  counterValue: { fontSize: 16, fontWeight: '500', color: Colors.black, minWidth: 30, textAlign: 'center' },
});
