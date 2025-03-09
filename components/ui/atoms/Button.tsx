import React, { ReactNode } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  View,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Typography } from './Typography';
import { colors } from '@/styles/theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * ボタンコンポーネント
 * HSPアプリの統一されたボタンスタイルを提供
 */
export const Button = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}: ButtonProps) => {
  // ボタンのサイズを設定
  const buttonSize = {
    small: styles.buttonSmall,
    medium: styles.buttonMedium,
    large: styles.buttonLarge,
  }[size];
  
  // ボタンのバリアントを設定
  const buttonVariant = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
    outline: styles.buttonOutline,
    text: styles.buttonText,
  }[variant];
  
  // テキストのバリアントを設定
  const textVariant = {
    primary: styles.textPrimary,
    secondary: styles.textSecondary,
    outline: styles.textOutline,
    text: styles.textText,
  }[variant];
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonSize,
        buttonVariant,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' || variant === 'secondary' ? 'white' : colors.primary.DEFAULT} 
          />
        ) : (
          <Typography 
            variant="button" 
            style={[
              textVariant,
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {children}
          </Typography>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonPrimary: {
    backgroundColor: colors.primary.DEFAULT,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary.DEFAULT,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.DEFAULT,
  },
  buttonText: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  textPrimary: {
    color: 'white',
  },
  textSecondary: {
    color: 'white',
  },
  textOutline: {
    color: colors.primary.DEFAULT,
  },
  textText: {
    color: colors.primary.DEFAULT,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    backgroundColor: colors.gray[300],
    borderColor: colors.gray[300],
  },
  textDisabled: {
    color: colors.gray[500],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
