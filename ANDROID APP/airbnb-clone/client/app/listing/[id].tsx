import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Image, Dimensions, FlatList, Platform, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useListingStore } from '../../stores/listingStore';
import { reviewService } from '../../services';
import { Colors, BorderRadius, Shadows, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedListing: listing, isLoading, fetchListing } = useListingStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchListing(id);
      loadReviews();
    }
  }, [id]);

  const loadReviews = async () => {
    try {
      const { data } = await reviewService.getListingReviews(id!, { limit: 5 });
      setReviews(data.data);
      setReviewStats(data.stats);
    } catch { }
  };

  if (isLoading || !listing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const ratingCategories = [
    { key: 'avgCleanliness', label: 'Cleanliness' },
    { key: 'avgAccuracy', label: 'Accuracy' },
    { key: 'avgCommunication', label: 'Communication' },
    { key: 'avgLocation', label: 'Location' },
    { key: 'avgCheckin', label: 'Check-in' },
    { key: 'avgValue', label: 'Value' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Image Carousel */}
        <View style={styles.imageCarousel}>
          <FlatList
            data={listing.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / width));
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
            )}
            keyExtractor={(_, i) => i.toString()}
          />
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {activeImageIndex + 1} / {listing.images.length}
            </Text>
          </View>

          {/* Back + Share buttons */}
          <TouchableOpacity style={[styles.headerButton, styles.backBtn]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.black} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="share-outline" size={22} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="heart-outline" size={22} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title Section */}
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="star" size={14} color={Colors.black} />
            <Text style={styles.ratingText}>
              {listing.averageRating?.toFixed(1) || 'New'} · {listing.reviewCount || 0} reviews
            </Text>
            <Text style={styles.dot}>·</Text>
            {listing.isSuperhost && (
              <>
                <Text style={styles.superhostText}>🏆 Superhost</Text>
                <Text style={styles.dot}>·</Text>
              </>
            )}
            <Text style={styles.locationText}>
              {listing.location.city}, {listing.location.country}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="people-outline" size={20} color={Colors.darkGray} />
              <Text style={styles.statText}>{listing.maxGuests} guests</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="bed-outline" size={20} color={Colors.darkGray} />
              <Text style={styles.statText}>{listing.bedrooms} bedrooms</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="water-outline" size={20} color={Colors.darkGray} />
              <Text style={styles.statText}>{listing.bathrooms} baths</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Host Card */}
          <View style={styles.hostCard}>
            <Image
              source={{ uri: listing.host?.avatar || 'https://ui-avatars.com/api/?name=H' }}
              style={styles.hostAvatar}
            />
            <View style={styles.hostInfo}>
              <Text style={styles.hostName}>Hosted by {listing.host?.name}</Text>
              {listing.isSuperhost && (
                <Text style={styles.hostBadge}>🏆 Superhost · 5+ years hosting</Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>About this place</Text>
          <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 4}>
            {listing.description}
          </Text>
          {listing.description.length > 200 && (
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.showMore}>{showFullDescription ? 'Show less' : 'Show more'} ›</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider} />

          {/* Amenities */}
          <Text style={styles.sectionTitle}>What this place offers</Text>
          <View style={styles.amenitiesGrid}>
            {listing.amenities.slice(0, 8).map((amenity, i) => (
              <View key={i} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.darkGray} />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
          {listing.amenities.length > 8 && (
            <TouchableOpacity style={styles.showAllButton}>
              <Text style={styles.showAllText}>
                Show all {listing.amenities.length} amenities
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider} />

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Ionicons name="star" size={18} color={Colors.black} />
            <Text style={styles.reviewsTitle}>
              {listing.averageRating?.toFixed(1)} · {listing.reviewCount} reviews
            </Text>
          </View>

          {reviewStats && (
            <View style={styles.ratingBreakdown}>
              {ratingCategories.map((cat) => (
                <View key={cat.key} style={styles.ratingRow}>
                  <Text style={styles.ratingLabel}>{cat.label}</Text>
                  <View style={styles.ratingBarContainer}>
                    <View
                      style={[styles.ratingBar, { width: `${((reviewStats[cat.key] || 0) / 5) * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.ratingValue}>{(reviewStats[cat.key] || 0).toFixed(1)}</Text>
                </View>
              ))}
            </View>
          )}

          {reviews.map((review) => (
            <View key={review._id} style={styles.reviewCard}>
              <View style={styles.reviewerRow}>
                <Image
                  source={{ uri: review.reviewer?.avatar || 'https://ui-avatars.com/api/?name=R' }}
                  style={styles.reviewerAvatar}
                />
                <View>
                  <Text style={styles.reviewerName}>{review.reviewer?.name}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              {review.hostReply && (
                <View style={styles.hostReply}>
                  <Text style={styles.hostReplyLabel}>Host reply:</Text>
                  <Text style={styles.hostReplyText}>{review.hostReply}</Text>
                </View>
              )}
            </View>
          ))}

          <View style={styles.divider} />

          {/* House Rules */}
          {listing.rules.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>House rules</Text>
              {listing.rules.map((rule, i) => (
                <View key={i} style={styles.ruleItem}>
                  <Ionicons name="information-circle-outline" size={20} color={Colors.darkGray} />
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
              <View style={styles.divider} />
            </>
          )}

          {/* Cancellation Policy */}
          <Text style={styles.sectionTitle}>Cancellation policy</Text>
          <Text style={styles.policyText}>
            {listing.cancellationPolicy === 'flexible'
              ? 'Free cancellation up to 24 hours before check-in.'
              : listing.cancellationPolicy === 'moderate'
              ? 'Free cancellation up to 5 days before check-in.'
              : 'Full refund for cancellations made within 48 hours of booking.'}
          </Text>

          {/* Bottom padding for sticky bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.price}>
            <Text style={styles.priceAmount}>${listing.pricePerNight}</Text> / night
          </Text>
          <Text style={styles.priceRating}>
            ⭐ {listing.averageRating?.toFixed(1) || 'New'} · {listing.reviewCount} reviews
          </Text>
        </View>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => router.push(`/booking/${listing._id}`)}
        >
          <Text style={styles.reserveText}>Reserve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageCarousel: { position: 'relative' },
  carouselImage: { width, height: width * 0.75, backgroundColor: Colors.lightGray },
  imageCounter: {
    position: 'absolute', bottom: 16, right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  imageCounterText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  headerButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center',
    ...Shadows.small,
  },
  backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 52 : 36, left: 16 },
  headerRight: {
    position: 'absolute', top: Platform.OS === 'ios' ? 52 : 36, right: 16,
    flexDirection: 'row', gap: 8,
  },
  content: { paddingHorizontal: 24, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: '600', color: Colors.black },
  locationRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 8, gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '500', color: Colors.black },
  dot: { color: Colors.gray },
  superhostText: { fontSize: 14, fontWeight: '500', color: Colors.black },
  locationText: { fontSize: 14, color: Colors.darkGray, textDecorationLine: 'underline' },
  divider: { height: 1, backgroundColor: Colors.lightGray, marginVertical: 24 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center', gap: 4 },
  statText: { fontSize: 14, color: Colors.darkGray },
  hostCard: { flexDirection: 'row', alignItems: 'center' },
  hostAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16, backgroundColor: Colors.lightGray },
  hostInfo: { flex: 1 },
  hostName: { fontSize: 18, fontWeight: '600', color: Colors.black },
  hostBadge: { fontSize: 14, color: Colors.gray, marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: Colors.black, marginBottom: 16 },
  description: { fontSize: 15, color: Colors.darkGray, lineHeight: 24 },
  showMore: { fontSize: 15, fontWeight: '600', color: Colors.black, marginTop: 8, textDecorationLine: 'underline' },
  amenitiesGrid: { gap: 12 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  amenityText: { fontSize: 15, color: Colors.darkGray },
  showAllButton: {
    marginTop: 16, borderWidth: 1, borderColor: Colors.black,
    borderRadius: BorderRadius.md, paddingVertical: 12, alignItems: 'center',
  },
  showAllText: { fontSize: 15, fontWeight: '600', color: Colors.black },
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  reviewsTitle: { fontSize: 20, fontWeight: '600', color: Colors.black },
  ratingBreakdown: { marginBottom: 24 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingLabel: { fontSize: 13, color: Colors.darkGray, width: 100 },
  ratingBarContainer: { flex: 1, height: 4, backgroundColor: Colors.lightGray, borderRadius: 2, marginHorizontal: 8 },
  ratingBar: { height: 4, backgroundColor: Colors.black, borderRadius: 2 },
  ratingValue: { fontSize: 13, fontWeight: '600', color: Colors.black, width: 30, textAlign: 'right' },
  reviewCard: { marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  reviewerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: Colors.lightGray },
  reviewerName: { fontSize: 15, fontWeight: '600', color: Colors.black },
  reviewDate: { fontSize: 13, color: Colors.gray },
  reviewComment: { fontSize: 15, color: Colors.darkGray, lineHeight: 22 },
  hostReply: { marginTop: 12, padding: 12, backgroundColor: Colors.lightGray, borderRadius: BorderRadius.sm },
  hostReplyLabel: { fontSize: 13, fontWeight: '600', color: Colors.black, marginBottom: 4 },
  hostReplyText: { fontSize: 14, color: Colors.darkGray },
  ruleItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  ruleText: { fontSize: 15, color: Colors.darkGray },
  policyText: { fontSize: 15, color: Colors.darkGray, lineHeight: 22 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 34 : 16, paddingTop: 16,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.mediumGray,
  },
  price: { fontSize: 16, color: Colors.black },
  priceAmount: { fontSize: 18, fontWeight: '700' },
  priceRating: { fontSize: 13, color: Colors.gray, marginTop: 2 },
  reserveButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  reserveText: { fontSize: 16, fontWeight: '600', color: Colors.white },
});
