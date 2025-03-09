import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/theme/colors';

/**
 * 認証関連画面のレイアウト
 * ログイン、登録、パスワードリセット画面を管理
 */
export default function AuthLayout() {
  const { colors: themeColors } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: themeColors.text.primary,
          headerTitleStyle: {
            fontFamily: 'NotoSansJP-Medium',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            title: 'ログイン',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: '新規登録',
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            title: 'パスワードをお忘れの方',
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}