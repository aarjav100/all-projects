import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { listingService } from '../../services';
import { Colors, BorderRadius, Amenities } from '../../constants/theme';

const PROPERTY_TYPES = ['house', 'apartment', 'cabin', 'villa', 'cottage', 'treehouse', 'castle', 'other'];
const CATEGORIES = ['trending', 'beachfront', 'cabins', 'castles', 'amazing_views', 'farms', 'tiny_homes'];

export default function CreateListingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'house', privacyType: 'entire' as const,
    category: 'trending', city: '', state: '', country: '',
    bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2,
    pricePerNight: 100, cleaningFee: 50,
    amenities: [] as string[], rules: [] as string[],
    cancellationPolicy: 'flexible' as const,
  });
  const [newRule, setNewRule] = useState('');

  const update = (key: string, value: any) => setForm({ ...form, [key]: value });
  const toggleAmenity = (a: string) => {
    update('amenities', form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a]);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.city) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await listingService.createListing({
        ...form,
        location: { city: form.city, state: form.state, country: form.country },
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
      });
      Alert.alert('Success!', 'Your listing has been created', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={s.c}>
      <View style={s.hdr}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
          <Ionicons name={step > 1 ? 'arrow-back' : 'close'} size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={s.hdrT}>Create Listing</Text>
        <Text style={s.st}>Step {step}/4</Text>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={s.sec}>
            <Text style={s.secTitle}>Basics</Text>
            <Text style={s.label}>Property Title *</Text>
            <TextInput style={s.inp} value={form.title} onChangeText={(v) => update('title', v)} placeholder="Cozy beachfront villa..." />
            <Text style={s.label}>Description *</Text>
            <TextInput style={[s.inp, { height: 120, textAlignVertical: 'top' }]} value={form.description} onChangeText={(v) => update('description', v)} placeholder="Describe your place..." multiline />
            <Text style={s.label}>Property Type</Text>
            <View style={s.chips}>
              {PROPERTY_TYPES.map((t) => (
                <TouchableOpacity key={t} style={[s.chip, form.type === t && s.chipA]} onPress={() => update('type', t)}>
                  <Text style={[s.chipT, form.type === t && s.chipTA]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.label}>Category</Text>
            <View style={s.chips}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity key={c} style={[s.chip, form.category === c && s.chipA]} onPress={() => update('category', c)}>
                  <Text style={[s.chipT, form.category === c && s.chipTA]}>{c.replace('_', ' ')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={s.sec}>
            <Text style={s.secTitle}>Location & Details</Text>
            <Text style={s.label}>City *</Text>
            <TextInput style={s.inp} value={form.city} onChangeText={(v) => update('city', v)} placeholder="San Francisco" />
            <Text style={s.label}>State</Text>
            <TextInput style={s.inp} value={form.state} onChangeText={(v) => update('state', v)} placeholder="California" />
            <Text style={s.label}>Country</Text>
            <TextInput style={s.inp} value={form.country} onChangeText={(v) => update('country', v)} placeholder="United States" />
            {[{ k: 'bedrooms', l: 'Bedrooms' }, { k: 'beds', l: 'Beds' }, { k: 'bathrooms', l: 'Bathrooms' }, { k: 'maxGuests', l: 'Max Guests' }].map(({ k, l }) => (
              <View key={k} style={s.ctr}>
                <Text style={s.ctrL}>{l}</Text>
                <View style={s.ctrC}>
                  <TouchableOpacity style={s.ctrB} onPress={() => update(k, Math.max(1, (form as any)[k] - 1))}>
                    <Ionicons name="remove" size={18} color={Colors.gray} />
                  </TouchableOpacity>
                  <Text style={s.ctrV}>{(form as any)[k]}</Text>
                  <TouchableOpacity style={s.ctrB} onPress={() => update(k, (form as any)[k] + 1)}>
                    <Ionicons name="add" size={18} color={Colors.gray} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {step === 3 && (
          <View style={s.sec}>
            <Text style={s.secTitle}>Amenities & Rules</Text>
            <View style={s.chips}>
              {Amenities.slice(0, 20).map((a) => (
                <TouchableOpacity key={a} style={[s.chip, form.amenities.includes(a) && s.chipA]} onPress={() => toggleAmenity(a)}>
                  <Text style={[s.chipT, form.amenities.includes(a) && s.chipTA]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[s.label, { marginTop: 24 }]}>House Rules</Text>
            {form.rules.map((r, i) => (
              <View key={i} style={s.ruleR}>
                <Text style={s.ruleT}>• {r}</Text>
                <TouchableOpacity onPress={() => update('rules', form.rules.filter((_, j) => j !== i))}>
                  <Ionicons name="close-circle" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            <View style={s.addRuleR}>
              <TextInput style={[s.inp, { flex: 1, marginBottom: 0 }]} value={newRule} onChangeText={setNewRule} placeholder="Add a rule..." />
              <TouchableOpacity style={s.addRuleB} onPress={() => { if (newRule.trim()) { update('rules', [...form.rules, newRule.trim()]); setNewRule(''); } }}>
                <Ionicons name="add" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={s.sec}>
            <Text style={s.secTitle}>Pricing</Text>
            <Text style={s.label}>Price per Night ($) *</Text>
            <TextInput style={s.inp} value={String(form.pricePerNight)} onChangeText={(v) => update('pricePerNight', parseInt(v) || 0)} keyboardType="numeric" />
            <Text style={s.label}>Cleaning Fee ($)</Text>
            <TextInput style={s.inp} value={String(form.cleaningFee)} onChangeText={(v) => update('cleaningFee', parseInt(v) || 0)} keyboardType="numeric" />
            <Text style={s.label}>Cancellation Policy</Text>
            <View style={s.chips}>
              {['flexible', 'moderate', 'strict'].map((p) => (
                <TouchableOpacity key={p} style={[s.chip, form.cancellationPolicy === p && s.chipA]} onPress={() => update('cancellationPolicy', p)}>
                  <Text style={[s.chipT, form.cancellationPolicy === p && s.chipTA]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={s.bot}>
        <TouchableOpacity style={s.btn} onPress={() => step < 4 ? setStep(step + 1) : handleSubmit()} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : (
            <Text style={s.btnT}>{step < 4 ? 'Continue' : 'Create Listing'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#fff' },
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  hdrT: { fontSize: 16, fontWeight: '600', color: '#222' },
  st: { fontSize: 14, color: '#767676' },
  scroll: { flex: 1 },
  sec: { padding: 24 },
  secTitle: { fontSize: 22, fontWeight: '600', color: '#222', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#484848', marginBottom: 8, marginTop: 16 },
  inp: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, height: 52, paddingHorizontal: 16, fontSize: 16, color: '#222', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  chipA: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipT: { fontSize: 14, color: '#484848' },
  chipTA: { color: '#fff', fontWeight: '600' },
  ctr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  ctrL: { fontSize: 16, color: '#222' },
  ctrC: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ctrB: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  ctrV: { fontSize: 16, fontWeight: '500', color: '#222', minWidth: 24, textAlign: 'center' },
  ruleR: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  ruleT: { fontSize: 15, color: '#484848' },
  addRuleR: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  addRuleB: { width: 44, height: 52, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  bot: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 34 : 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#ddd' },
  btn: { height: 56, backgroundColor: Colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnT: { fontSize: 17, fontWeight: '600', color: '#fff' },
});
