import { create } from 'zustand';
import { listingService } from '../services';

interface Listing {
  _id: string;
  host: any;
  title: string;
  description: string;
  type: string;
  privacyType: string;
  category: string;
  location: any;
  images: string[];
  amenities: string[];
  bedrooms: number;
  beds: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  rules: string[];
  cancellationPolicy: string;
  isActive: boolean;
  isSuperhost: boolean;
  averageRating: number;
  reviewCount: number;
}

interface ListingState {
  listings: Listing[];
  selectedListing: Listing | null;
  isLoading: boolean;
  error: string | null;
  pagination: { page: number; pages: number; total: number; hasMore: boolean };
  selectedCategory: string;
  searchQuery: string;
  filters: Record<string, any>;

  fetchListings: (params?: any) => Promise<void>;
  fetchMore: () => Promise<void>;
  fetchListing: (id: string) => Promise<void>;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;
}

export const useListingStore = create<ListingState>((set, get) => ({
  listings: [],
  selectedListing: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, pages: 1, total: 0, hasMore: false },
  selectedCategory: 'trending',
  searchQuery: '',
  filters: {},

  fetchListings: async (params?: any) => {
    try {
      set({ isLoading: true, error: null });
      const { selectedCategory, searchQuery, filters } = get();
      const { data } = await listingService.getListings({
        category: selectedCategory,
        search: searchQuery || undefined,
        ...filters,
        ...params,
        page: 1,
      });
      set({
        listings: data.data,
        pagination: data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMore: async () => {
    const { pagination, listings, selectedCategory, searchQuery, filters } = get();
    if (!pagination.hasMore) return;

    try {
      const { data } = await listingService.getListings({
        category: selectedCategory,
        search: searchQuery || undefined,
        ...filters,
        page: pagination.page + 1,
      });
      set({
        listings: [...listings, ...data.data],
        pagination: data.pagination,
      });
    } catch {
      // Silent fail
    }
  },

  fetchListing: async (id: string) => {
    try {
      set({ isLoading: true });
      const { data } = await listingService.getListing(id);
      set({ selectedListing: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setCategory: (category) => {
    set({ selectedCategory: category });
    get().fetchListings();
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));
