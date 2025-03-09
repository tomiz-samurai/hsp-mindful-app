import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { MMKV } from '@/lib/utils/storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // システムのカラースキーマを取得
  const systemColorScheme = useColorScheme();
  
  // 保存されたテーマモードを取得、デフォルトは'system'
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  
  // 現在の表示モードがダークかどうか
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  
  // 初期化時に保存されたテーマモードを読み込む
  useEffect(() => {
    const savedThemeMode = MMKV.getString('themeMode') as ThemeMode | undefined;
    if (savedThemeMode) {
      setThemeModeState(savedThemeMode);
    }
  }, []);
  
  // テーマモードが変更されたとき、または
  // システムのカラースキーマが変更されたときに表示モードを更新
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);
  
  // テーマモードを変更し、保存する
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    MMKV.set('themeMode', mode);
  };
  
  const value = {
    themeMode,
    isDark,
    setThemeMode,
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
