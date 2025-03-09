import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'HSP Mindful App',
  slug: 'hsp-mindful-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#F8F3E6'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.tomizsamurai.hspmindfulapp'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F8F3E6'
    },
    package: 'com.tomizsamurai.hspmindfulapp'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    eas: {
      projectId: 'your-project-id'
    }
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-av',
    'expo-notifications',
    'expo-keep-awake',
    'expo-in-app-purchases'
  ]
};

export default config;