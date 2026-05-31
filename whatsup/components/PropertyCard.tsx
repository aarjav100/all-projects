import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, MapPin, Bed, Bath, Maximize } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Property } from '@/types/chat';

const { width } = Dimensions.get('window');

interface Props {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  compact?: boolean;
}

export default function PropertyCard({ property, isFavorite = false, onToggleFavorite, compact = false }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={[styles.card, compact && styles.compactCard]}
      onPress={() => router.push({ pathname: `/property/${property.id}`, params: { id: property.id } })}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={[styles.image, compact && styles.compactImage]}
          resizeMode="cover"
        />
        {/* Featured Badge */}
        {property.isFeatured && !compact && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
          </View>
        )}
        {/* Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{property.type}</Text>
        </View>
        {/* Favorite Button */}
        <Pressable
          style={styles.favoriteBtn}
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleFavorite?.(property.id);
          }}
          hitSlop={8}
        >
          <Heart
            size={18}
            color={isFavorite ? Colors.favorite : Colors.textLight}
            fill={isFavorite ? Colors.favorite : 'transparent'}
          />
        </Pressable>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{property.title}</Text>

        <View style={styles.locationRow}>
          <MapPin size={12} color={Colors.textSecondary} />
          <Text style={styles.location} numberOfLines={1}>
            {property.location.address}, {property.location.city}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Bed size={13} color={Colors.textSecondary} />
            <Text style={styles.statText}>{property.bedrooms} Bed</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.stat}>
            <Bath size={13} color={Colors.textSecondary} />
            <Text style={styles.statText}>{property.bathrooms} Bath</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.stat}>
            <Maximize size={13} color={Colors.textSecondary} />
            <Text style={styles.statText}>{property.area} sqft</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{property.price.toLocaleString('en-IN')}
            <Text style={styles.priceUnit}>/{property.priceUnit}</Text>
          </Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {property.rating}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  compactCard: {
    width: width * 0.65,
    marginRight: 12,
    marginBottom: 0,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  compactImage: {
    height: 150,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  featuredText: {
    color: Colors.textLight,
    fontSize: 11,
    fontWeight: '700',
  },
  typeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(26,31,54,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeText: {
    color: Colors.textLight,
    fontSize: 11,
    fontWeight: '600',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 8,
  },
  info: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  location: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textTertiary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.price,
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  ratingBadge: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
