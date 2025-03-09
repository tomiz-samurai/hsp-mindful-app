import React, { useEffect } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NativeWindStyleSheet } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ModalProvider } from '@/components/providers/ModalProvider';
import { paperTheme } from '@/styles/theme/paper';
import { colors } from '@/styles/theme/colors';

// アプリが準備できるまでSplashScreenを表示
SplashScreen.preventAutoHideAsync();

// NativeWindをメモリリーク防止モードで使用
NativeWindStyleSheet.setOutput({
  default: 'native',
});

/**
 * アプリケーションのルートレイアウト
 * すべてのプロバイダーとグローバル設定を提供
 */
export default function RootLayout() {
  // フォントの読み込み
  const [fontsLoaded] = useFonts({
    'NotoSansJP-Regular': require('@/assets/fonts/NotoSansJP-Regular.otf'),
    'NotoSansJP-Medium': require('@/assets/fonts/NotoSansJP-Medium.otf'),
    'NotoSansJP-Bold': require('@/assets/fonts/NotoSansJP-Bold.otf'),
  });
  
  // システムUIの色を設定
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background.primary);
  }, []);
  
  // フォントとリソースのロードが完了したらSplashScreenを非表示
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  // リソースの読み込みが完了していない場合は何も表示しない
  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <PaperProvider theme={paperTheme}>
              <ModalProvider>
                <StatusBar style="auto" />
                <Slot />
              </ModalProvider>
            </PaperProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}