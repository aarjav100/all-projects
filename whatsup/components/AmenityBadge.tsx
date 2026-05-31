import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { AMENITY_ICONS } from '@/mocks/properties';

interface Props {
  amenity: string;
  size?: 'sm' | 'md';
}

export default function AmenityBadge({ amenity, size = 'md' }: Props) {
  const icon = AMENITY_ICONS[amenity] || '✅';
  return (
    <View style={[styles.badge, size === 'sm' && styles.sm]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, size === 'sm' && styles.labelSm]}>{amenity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginRight: 8,
    marginBottom: 8,
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  icon: {
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  labelSm: {
    fontSize: 11,
  },
});
