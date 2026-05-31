import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Image, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../stores/bookingStore';
import { listingService, paymentService } from '../../services';
import { Colors, BorderRadius, Shadows } from '../../constants/theme';

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { createBooking } = useBookingStore();
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=dates, 2=guests, 3=review, 4=confirmation

  // Booking state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });

  useEffect(() => {
    if (id) {
      listingService.getListing(id).then(({ data }) => setListing(data.data));
    }
  }, [id]);

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 3; // Default preview

  const subtotal = (listing?.pricePerNight || 0) * nights;
  const cleaningFee = listing?.cleaningFee || 0;
  const serviceFee = Math.round(subtotal * 0.12);
  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + cleaningFee + serviceFee + taxes;

  // Use default dates if none selected
  const defaultCheckIn = new Date();
  defaultCheckIn.setDate(defaultCheckIn.getDate() + 7);
  const defaultCheckOut = new Date(defaultCheckIn);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 3);

  const finalCheckIn = checkIn || defaultCheckIn.toISOString().split('T')[0];
  const finalCheckOut = checkOut || defaultCheckOut.toISOString().split('T')[0];

  const handleBook = async () => {
    setIsLoading(true);
    try {
      const booking = await createBooking({
        listing: id,
        checkIn: finalCheckIn,
        checkOut: finalCheckOut,
        guests,
      });

      // Create payment intent
      try {
        await paymentService.createPaymentIntent(booking._id);
      } catch { }

      setStep(4);
    } catch (error: any) {
      Alert.alert('Booking Failed', error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const adjustGuests = (type: keyof typeof guests, delta: number) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta),
    }));
  };

  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Step 4: Confirmation
  if (step === 4) {
    return (
      <View style={styles.confirmationContainer}>
        <View style={styles.confirmationContent}>
          <Text style={styles.confirmationEmoji}>🎉</Text>
          <Text style={styles.confirmationTitle}>Booking Confirmed!</Text>
          <Text style={styles.confirmationSubtitle}>
            Your trip to {listing.location?.city} is booked.
          </Text>

          <View style={styles.confirmationCard}>
            <Image
              source={{ uri: listing.images?.[0] }}
              style={styles.confirmationImage}
            />
            <Text style={styles.confirmationListing}>{listing.title}</Text>
            <Text style={styles.confirmationDates}>
              {new Date(finalCheckIn).toLocaleDateString()} → {new Date(finalCheckOut).toLocaleDateString()}
            </Text>
            <Text style={styles.confirmationTotal}>
              Total: ${total}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.replace('/(tabs)/trips')}
          >
            <Text style={styles.doneButtonText}>View My Trips</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
          <Ionicons name={step > 1 ? 'arrow-back' : 'close'} size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 1 ? 'Select Dates' : step === 2 ? 'Guests' : 'Confirm Booking'}
        </Text>
        <Text style={styles.stepIndicator}>Step {step}/3</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Listing Summary */}
        <View style={styles.listingSummary}>
          <Image source={{ uri: listing.images?.[0] }} style={styles.summaryImage} />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle} numberOfLines={2}>{listing.title}</Text>
            <Text style={styles.summaryLocation}>
              {listing.location?.city}, {listing.location?.country}
            </Text>
            <Text style={styles.summaryRating}>
              ⭐ {listing.averageRating?.toFixed(1)} ({listing.reviewCount} reviews)
            </Text>
          </View>
        </View>

        {/* Step 1: Dates */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>When is your trip?</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateLabel}>CHECK-IN</Text>
                <Text style={styles.dateValue}>
                  {new Date(finalCheckIn).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <Ionicons name="arrow-forward" size={18} color={Colors.gray} />
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateLabel}>CHECK-OUT</Text>
                <Text style={styles.dateValue}>
                  {new Date(finalCheckOut).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.nightsText}>{nights} nights</Text>
          </View>
        )}

        {/* Step 2: Guests */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Who's coming?</Text>
            {[
              { key: 'adults' as const, label: 'Adults', sub: 'Ages 13+' },
              { key: 'children' as const, label: 'Children', sub: 'Ages 2-12' },
              { key: 'infants' as const, label: 'Infants', sub: 'Under 2' },
              { key: 'pets' as const, label: 'Pets', sub: 'Service animals always welcome' },
            ].map((item) => (
              <View key={item.key} style={styles.guestRow}>
                <View>
                  <Text style={styles.guestLabel}>{item.label}</Text>
                  <Text style={styles.guestSub}>{item.sub}</Text>
                </View>
                <View style={styles.guestControls}>
                  <TouchableOpacity
                    style={[styles.guestButton, guests[item.key] <= (item.key === 'adults' ? 1 : 0) && styles.guestButtonDisabled]}
                    onPress={() => adjustGuests(item.key, -1)}
                  >
                    <Ionicons name="remove" size={18} color={Colors.gray} />
                  </TouchableOpacity>
                  <Text style={styles.guestCount}>{guests[item.key]}</Text>
                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={() => adjustGuests(item.key, 1)}
                  >
                    <Ionicons name="add" size={18} color={Colors.gray} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Step 3: Review & Price */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Price details</Text>
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  ${listing.pricePerNight} × {nights} nights
                </Text>
                <Text style={styles.priceValue}>${subtotal}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Cleaning fee</Text>
                <Text style={styles.priceValue}>${cleaningFee}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Service fee</Text>
                <Text style={styles.priceValue}>${serviceFee}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Taxes</Text>
                <Text style={styles.priceValue}>${taxes}</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total}</Text>
              </View>
            </View>

            <View style={styles.tripDetails}>
              <Text style={styles.tripDetailTitle}>Trip details</Text>
              <View style={styles.tripDetailRow}>
                <Ionicons name="calendar-outline" size={18} color={Colors.darkGray} />
                <Text style={styles.tripDetailText}>
                  {new Date(finalCheckIn).toLocaleDateString()} → {new Date(finalCheckOut).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.tripDetailRow}>
                <Ionicons name="people-outline" size={18} color={Colors.darkGray} />
                <Text style={styles.tripDetailText}>
                  {guests.adults} adult{guests.adults > 1 ? 's' : ''}
                  {guests.children > 0 ? `, ${guests.children} child${guests.children > 1 ? 'ren' : ''}` : ''}
                  {guests.infants > 0 ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => step < 3 ? setStep(step + 1) : handleBook()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.actionButtonText}>
              {step < 3 ? 'Continue' : `Confirm & Pay · $${total}`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: Colors.black },
  stepIndicator: { fontSize: 14, color: Colors.gray },
  scrollContent: { flex: 1 },
  listingSummary: {
    flexDirection: 'row', padding: 24,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  summaryImage: { width: 80, height: 80, borderRadius: BorderRadius.md, marginRight: 16, backgroundColor: Colors.lightGray },
  summaryInfo: { flex: 1, justifyContent: 'center' },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: Colors.black },
  summaryLocation: { fontSize: 14, color: Colors.gray, marginTop: 2 },
  summaryRating: { fontSize: 13, color: Colors.darkGray, marginTop: 4 },
  stepContent: { padding: 24 },
  sectionTitle: { fontSize: 22, fontWeight: '600', color: Colors.black, marginBottom: 20 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dateInput: {
    flex: 1, padding: 16, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.mediumGray,
  },
  dateLabel: { fontSize: 11, color: Colors.gray, fontWeight: '600', letterSpacing: 0.5 },
  dateValue: { fontSize: 16, color: Colors.black, marginTop: 4, fontWeight: '500' },
  nightsText: { fontSize: 14, color: Colors.gray, marginTop: 12 },
  guestRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  guestLabel: { fontSize: 16, fontWeight: '500', color: Colors.black },
  guestSub: { fontSize: 13, color: Colors.gray, marginTop: 2 },
  guestControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  guestButton: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1,
    borderColor: Colors.mediumGray, justifyContent: 'center', alignItems: 'center',
  },
  guestButtonDisabled: { opacity: 0.4 },
  guestCount: { fontSize: 16, fontWeight: '500', color: Colors.black, minWidth: 20, textAlign: 'center' },
  priceBreakdown: {
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.lightGray, padding: 20,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  priceLabel: { fontSize: 15, color: Colors.darkGray },
  priceValue: { fontSize: 15, color: Colors.darkGray },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.lightGray, paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.black },
  totalValue: { fontSize: 16, fontWeight: '700', color: Colors.black },
  tripDetails: { marginTop: 24 },
  tripDetailTitle: { fontSize: 18, fontWeight: '600', color: Colors.black, marginBottom: 12 },
  tripDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  tripDetailText: { fontSize: 15, color: Colors.darkGray },
  bottomAction: {
    paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 34 : 16, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: Colors.mediumGray, backgroundColor: Colors.white,
  },
  actionButton: {
    height: 56, backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  actionButtonText: { fontSize: 17, fontWeight: '600', color: Colors.white },
  // Confirmation
  confirmationContainer: { flex: 1, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  confirmationContent: { alignItems: 'center', paddingHorizontal: 40 },
  confirmationEmoji: { fontSize: 64, marginBottom: 16 },
  confirmationTitle: { fontSize: 28, fontWeight: '700', color: Colors.black, marginBottom: 8 },
  confirmationSubtitle: { fontSize: 16, color: Colors.gray, textAlign: 'center', marginBottom: 32 },
  confirmationCard: {
    width: '100%', borderRadius: BorderRadius.lg, borderWidth: 1,
    borderColor: Colors.lightGray, overflow: 'hidden', marginBottom: 32,
  },
  confirmationImage: { width: '100%', height: 160, backgroundColor: Colors.lightGray },
  confirmationListing: { fontSize: 18, fontWeight: '600', color: Colors.black, padding: 16, paddingBottom: 4 },
  confirmationDates: { fontSize: 14, color: Colors.gray, paddingHorizontal: 16 },
  confirmationTotal: { fontSize: 16, fontWeight: '600', color: Colors.black, padding: 16, paddingTop: 8 },
  doneButton: {
    width: '100%', height: 56, backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center',
  },
  doneButtonText: { fontSize: 17, fontWeight: '600', color: Colors.white },
});
