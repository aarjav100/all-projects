import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  Pressable, FlatList, Dimensions, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  Heart, MapPin, Bed, Bath, Maximize, ArrowLeft,
  MessageSquare, Phone, Share2, Star
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AmenityBadge from '@/components/AmenityBadge';
import Colors from '@/constants/colors';
import { MOCK_PROPERTIES } from '@/mocks/properties';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  const property = MOCK_PROPERTIES.find(p => p.id === id);
  if (!property) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={property.images}
            keyExtractor={(_, i) => i.toString()}
            onScroll={(e) => setCurrentImage(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.galleryImage} />
            )}
          />
          {/* Dots */}
          <View style={styles.dots}>
            {property.images.map((_, i) => (
              <View key={i} style={[styles.dot, currentImage === i && styles.dotActive]} />
            ))}
          </View>

          {/* Overlay Buttons */}
          <Pressable style={[styles.overlayBtn, { left: 16 }]} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.textPrimary} />
          </Pressable>
          <Pressable style={[styles.overlayBtn, { right: 56 }]} onPress={() => Alert.alert('Share', 'Share link copied!')}>
            <Share2 size={18} color={Colors.textPrimary} />
          </Pressable>
          <Pressable style={[styles.overlayBtn, { right: 16 }]} onPress={() => setIsFavorite(!isFavorite)}>
            <Heart size={18} color={isFavorite ? Colors.favorite : Colors.textPrimary} fill={isFavorite ? Colors.favorite : 'transparent'} />
          </Pressable>

          {/* Type Badge */}
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{property.type}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{property.title}</Text>
            <View style={styles.ratingPill}>
              <Star size={12} color={Colors.star} fill={Colors.star} />
              <Text style={styles.ratingText}>{property.rating} ({property.reviewCount})</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationRow}>
            <MapPin size={14} color={Colors.secondary} />
            <Text style={styles.locationText}>
              {property.location.address}, {property.location.city}, {property.location.state}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Bed size={20} color={Colors.primary} />
              <Text style={styles.statNum}>{property.bedrooms}</Text>
              <Text style={styles.statLabel}>Bedrooms</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Bath size={20} color={Colors.primary} />
              <Text style={styles.statNum}>{property.bathrooms}</Text>
              <Text style={styles.statLabel}>Bathrooms</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Maximize size={20} color={Colors.primary} />
              <Text style={styles.statNum}>{property.area}</Text>
              <Text style={styles.statLabel}>Sq. Ft.</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this property</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesWrap}>
              {property.amenities.map(a => <AmenityBadge key={a} amenity={a} />)}
            </View>
          </View>

          {/* Landlord */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listed by</Text>
            <View style={styles.landlordCard}>
              <View style={styles.landlordAvatar}>
                <Text style={styles.landlordAvatarText}>{property.landlord.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.landlordName}>{property.landlord.name}</Text>
                <Text style={styles.landlordSub}>{property.landlord.isOnline ? '🟢 Online now' : '⚫ Offline'}</Text>
              </View>
              <Pressable
                style={styles.msgBtn}
                onPress={() => router.push({ pathname: `/chat/${property.id}`, params: { name: property.landlord.name } })}
              >
                <MessageSquare size={16} color={Colors.textLight} />
              </Pressable>
              <Pressable style={[styles.msgBtn, { backgroundColor: Colors.success }]}>
                <Phone size={16} color={Colors.textLight} />
              </Pressable>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>₹{property.price.toLocaleString('en-IN')}<Text style={styles.bottomPriceUnit}>/{property.priceUnit}</Text></Text>
        </View>
        <Pressable style={styles.bookBtn} onPress={() => Alert.alert('Book a Visit', 'Your visit request has been sent to the landlord!')}>
          <LinearGradient colors={Colors.primaryGradient} style={styles.bookBtnGrad}>
            <Text style={styles.bookBtnText}>Book a Visit</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  galleryContainer: { position: 'relative', height: 290 },
  galleryImage: { width, height: 290, resizeMode: 'cover' },
  dots: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: Colors.textLight, width: 18 },
  overlayBtn: {
    position: 'absolute', top: 52,
    backgroundColor: Colors.glassBg, borderRadius: 22, padding: 9,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 4,
  },
  typeBadge: {
    position: 'absolute', bottom: 12, left: 16,
    backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
  },
  typeText: { color: Colors.textLight, fontSize: 12, fontWeight: '700' },
  content: { paddingHorizontal: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 18, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, flex: 1, marginRight: 10 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.backgroundSecondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  ratingText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 18 },
  locationText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  statsCard: {
    flexDirection: 'row', backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16, padding: 16, marginBottom: 20, alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.divider },
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  amenitiesWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  landlordCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.backgroundSecondary, borderRadius: 14, padding: 14,
  },
  landlordAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  landlordAvatarText: { color: Colors.textLight, fontSize: 20, fontWeight: '700' },
  landlordName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  landlordSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  msgBtn: { backgroundColor: Colors.primary, borderRadius: 22, padding: 9 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.background, paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: Colors.divider,
    shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 1, shadowRadius: 10, elevation: 10,
  },
  bottomPrice: { fontSize: 22, fontWeight: '800', color: Colors.price },
  bottomPriceUnit: { fontSize: 13, fontWeight: '400', color: Colors.textSecondary },
  bookBtn: { borderRadius: 14, overflow: 'hidden' },
  bookBtnGrad: { paddingHorizontal: 28, paddingVertical: 14 },
  bookBtnText: { color: Colors.textLight, fontSize: 16, fontWeight: '700' },
});
