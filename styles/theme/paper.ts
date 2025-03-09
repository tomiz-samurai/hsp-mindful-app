import { MD3LightTheme } from 'react-native-paper';
import { colors } from './colors';
import { typography } from './typography';

/**
 * React Native Paper用のカスタムテーマ設定
 */
export const paperTheme = {
  ...MD3LightTheme,
  
  // カラーパレットの設定
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary.DEFAULT,
    primaryContainer: colors.primary.light,
    secondary: colors.secondary.DEFAULT,
    secondaryContainer: colors.secondary.light,
    background: colors.background.primary,
    surface: colors.background.secondary,
    error: colors.status.error,
    text: colors.text.primary,
    onSurface: colors.text.primary,
    backdrop: '#00000020',
  },
  
  // フォントの設定
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: 'NotoSansJP-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'NotoSansJP-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'NotoSansJP-Regular',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'NotoSansJP-Regular',
      fontWeight: 'normal',
    },
  },
  
  // 他のカスタム設定
  roundness: 12,
};