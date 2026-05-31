import { create } from 'zustand';
import { bookingService } from '../services';

interface BookingState {
  guestBookings: any[];
  hostBookings: any[];
  selectedBooking: any | null;
  isLoading: boolean;

  fetchGuestBookings: (status?: string) => Promise<void>;
  fetchHostBookings: (status?: string) => Promise<void>;
  fetchBooking: (id: string) => Promise<void>;
  createBooking: (data: any) => Promise<any>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set) => ({
  guestBookings: [],
  hostBookings: [],
  selectedBooking: null,
  isLoading: false,

  fetchGuestBookings: async (status?) => {
    try {
      set({ isLoading: true });
      const { data } = await bookingService.getGuestBookings(status);
      set({ guestBookings: data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchHostBookings: async (status?) => {
    try {
      set({ isLoading: true });
      const { data } = await bookingService.getHostBookings(status);
      set({ hostBookings: data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchBooking: async (id) => {
    try {
      set({ isLoading: true });
      const { data } = await bookingService.getBooking(id);
      set({ selectedBooking: data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createBooking: async (bookingData) => {
    const { data } = await bookingService.createBooking(bookingData);
    return data.data;
  },

  cancelBooking: async (id, reason?) => {
    await bookingService.cancelBooking(id, reason);
    set((state) => ({
      guestBookings: state.guestBookings.map((b) =>
        b._id === id ? { ...b, status: 'cancelled' } : b
      ),
    }));
  },
}));
