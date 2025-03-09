import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/styles/theme/colors';

/**
 * メイン画面のレイアウト（タブナビゲーション）
 * アプリの主要な機能にアクセスするためのタブを提供
 */
export default function MainLayout() {
  const { colors: themeColors } = useTheme();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  const isDark = colorScheme === 'dark';
  
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? colors.darkMode.colors.background.secondary : colors.background.secondary,
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: isDark ? colors.darkMode.colors.text.tertiary : colors.text.tertiary,
        tabBarLabelStyle: {
          fontFamily: 'NotoSansJP-Regular',
          fontSize: 12,
          paddingBottom: 4,
        },
        headerStyle: {
          backgroundColor: isDark ? colors.darkMode.colors.background.primary : colors.background.primary,
        },
        headerTintColor: isDark ? colors.darkMode.colors.text.primary : colors.text.primary,
        headerTitleStyle: {
          fontFamily: 'NotoSansJP-Medium',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'ミミ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mindfulness"
        options={{
          title: 'リラックス',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'マイページ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}