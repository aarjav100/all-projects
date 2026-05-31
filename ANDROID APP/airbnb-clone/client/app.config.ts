import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Airbnb Clone',
  slug: 'airbnb-clone',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'airbnb-clone',
  splash: {
    backgroundColor: '#FF385C',
    resizeMode: 'contain',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.airbnbclone.app',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#FF385C',
    },
    package: 'com.airbnbclone.app',
  },
  plugins: ['expo-router', 'expo-font', 'expo-asset'],
  extra: {
    API_URL: process.env.API_URL || 'http://localhost:5000/api',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  },
});
