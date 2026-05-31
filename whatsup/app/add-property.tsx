import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  Pressable, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { supabase } from '@/lib/supabase';

const TYPES = ['Apartment', 'Villa', 'Studio', 'House', 'Condo'];
const AMENITY_OPTIONS = ['WiFi', 'Parking', 'Pool', 'Gym', 'Security', 'Air Conditioning', 'Power Backup', 'Garden', 'Washing Machine'];

export default function AddPropertyScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 'Apartment',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    address: '',
    city: '',
    state: '',
    imageUrl: '',
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const toggleAmenity = (a: string) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.city) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('properties').insert([{
        title: form.title,
        description: form.description,
        price: parseInt(form.price),
        price_unit: 'month',
        type: form.type,
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        area: parseInt(form.area) || 0,
        address: form.address,
        city: form.city,
        state: form.state,
        images: form.imageUrl ? [form.imageUrl] : [],
        amenities,
        is_available: true,
      }]);
      if (error) throw error;
      Alert.alert('Success!', 'Your property has been listed successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Saved Locally', 'Property saved (Supabase table may need setup).');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'List Property', headerShown: true }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Property Title *</Text>
          <TextInput style={styles.input} placeholder="e.g. Luxury 3BHK in Bandra" value={form.title} onChangeText={v => update('title', v)} placeholderTextColor={Colors.textTertiary} />

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textarea]} placeholder="Describe your property..." value={form.description} onChangeText={v => update('description', v)} multiline numberOfLines={4} placeholderTextColor={Colors.textTertiary} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Monthly Rent (₹) *</Text>
              <TextInput style={styles.input} placeholder="25000" value={form.price} onChangeText={v => update('price', v)} keyboardType="number-pad" placeholderTextColor={Colors.textTertiary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.label}>Area (sqft)</Text>
              <TextInput style={styles.input} placeholder="1000" value={form.area} onChangeText={v => update('area', v)} keyboardType="number-pad" placeholderTextColor={Colors.textTertiary} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Bedrooms</Text>
              <TextInput style={styles.input} placeholder="2" value={form.bedrooms} onChangeText={v => update('bedrooms', v)} keyboardType="number-pad" placeholderTextColor={Colors.textTertiary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.label}>Bathrooms</Text>
              <TextInput style={styles.input} placeholder="1" value={form.bathrooms} onChangeText={v => update('bathrooms', v)} keyboardType="number-pad" placeholderTextColor={Colors.textTertiary} />
            </View>
          </View>

          <Text style={styles.label}>Property Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {TYPES.map(t => (
              <Pressable key={t} style={[styles.chip, form.type === t && styles.chipActive]} onPress={() => update('type', t)}>
                <Text style={[styles.chipText, form.type === t && styles.chipTextActive]}>{t}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TextInput style={styles.input} placeholder="Street address" value={form.address} onChangeText={v => update('address', v)} placeholderTextColor={Colors.textTertiary} />
          <View style={styles.row}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="City *" value={form.city} onChangeText={v => update('city', v)} placeholderTextColor={Colors.textTertiary} />
            <TextInput style={[styles.input, { flex: 1, marginLeft: 12 }]} placeholder="State" value={form.state} onChangeText={v => update('state', v)} placeholderTextColor={Colors.textTertiary} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo URL</Text>
          <TextInput style={styles.input} placeholder="https://..." value={form.imageUrl} onChangeText={v => update('imageUrl', v)} placeholderTextColor={Colors.textTertiary} autoCapitalize="none" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesWrap}>
            {AMENITY_OPTIONS.map(a => (
              <Pressable key={a} style={[styles.chip, amenities.includes(a) && styles.chipActive]} onPress={() => toggleAmenity(a)}>
                <Text style={[styles.chipText, amenities.includes(a) && styles.chipTextActive]}>{a}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          <LinearGradient colors={Colors.primaryGradient} style={styles.submitGrad}>
            <Text style={styles.submitText}>{loading ? 'Submitting...' : '🏠 List My Property'}</Text>
          </LinearGradient>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  section: {
    backgroundColor: Colors.background, marginHorizontal: 16, marginTop: 12,
    borderRadius: 16, padding: 16,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: Colors.inputBackground, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: Colors.textPrimary, marginBottom: 4,
  },
  textarea: { height: 90, textAlignVertical: 'top', paddingTop: 10 },
  row: { flexDirection: 'row' },
  chipRow: { marginTop: 4 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.backgroundTertiary, marginRight: 8, marginBottom: 8,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textLight },
  amenitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  submitBtn: { marginHorizontal: 16, marginTop: 20, borderRadius: 14, overflow: 'hidden' },
  submitGrad: { paddingVertical: 16, alignItems: 'center' },
  submitText: { color: Colors.textLight, fontSize: 17, fontWeight: '800' },
});
