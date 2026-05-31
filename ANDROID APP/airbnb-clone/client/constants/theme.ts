export const Colors = {
  primary: '#FF385C',
  primaryDark: '#E31C5F',
  primaryLight: '#FF5A5F',

  secondary: '#00A699',
  accent: '#FC642D',

  black: '#222222',
  darkGray: '#484848',
  gray: '#767676',
  mediumGray: '#DDDDDD',
  lightGray: '#F7F7F7',
  white: '#FFFFFF',

  success: '#008A05',
  error: '#C13515',
  warning: '#E07912',
  info: '#428BFF',

  star: '#FFB400',
  overlay: 'rgba(0,0,0,0.4)',
  cardShadow: 'rgba(0,0,0,0.08)',

  // Dark mode
  dark: {
    background: '#1A1A2E',
    surface: '#16213E',
    card: '#0F3460',
    text: '#EAEAEA',
    textSecondary: '#B0B0B0',
  },
};

export const Fonts = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Categories = [
  { key: 'trending', label: 'Trending', icon: 'flame-outline' },
  { key: 'beachfront', label: 'Beachfront', icon: 'water-outline' },
  { key: 'cabins', label: 'Cabins', icon: 'home-outline' },
  { key: 'castles', label: 'Castles', icon: 'business-outline' },
  { key: 'amazing_views', label: 'Amazing Views', icon: 'eye-outline' },
  { key: 'farms', label: 'Farms', icon: 'leaf-outline' },
  { key: 'tiny_homes', label: 'Tiny Homes', icon: 'cube-outline' },
  { key: 'lakefront', label: 'Lakefront', icon: 'fish-outline' },
  { key: 'skiing', label: 'Skiing', icon: 'snow-outline' },
  { key: 'tropical', label: 'Tropical', icon: 'sunny-outline' },
];

export const Amenities = [
  'WiFi', 'Kitchen', 'Free parking', 'Pool', 'Hot tub',
  'Air conditioning', 'Washer', 'Dryer', 'Heating',
  'TV', 'Fireplace', 'BBQ grill', 'Gym', 'Elevator',
  'Beach access', 'Garden', 'Balcony', 'City view',
  'Mountain view', 'Lake view', 'Pets allowed',
  'Breakfast included', 'Self check-in', 'Smoke alarm',
];
