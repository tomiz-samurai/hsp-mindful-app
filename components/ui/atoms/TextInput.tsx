import React, { useState } from 'react';
import { View, TextInput as RNTextInput, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextInputProps as RNTextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/theme/colors';
import { Typography } from './Typography';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * カスタムテキスト入力コンポーネント
 * HSPユーザー向けに視覚的に静かなスタイルを提供
 */
export const TextInput = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  secureTextEntry = false,
  style,
  ...rest
}: TextInputProps) => {
  const [isSecureTextHidden, setIsSecureTextHidden] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Typography variant="caption" style={styles.label}>
          {label}
        </Typography>
      )}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError
      ]}>
        {icon && iconPosition === 'left' && (
          <Ionicons name={icon} size={20} color={colors.text.secondary} style={styles.leftIcon} />
        )}
        
        <RNTextInput
          style={[
            styles.input,
            icon && iconPosition === 'left' && styles.inputWithLeftIcon,
            (icon && iconPosition === 'right') || secureTextEntry && styles.inputWithRightIcon
          ]}
          placeholderTextColor={colors.text.tertiary}
          secureTextEntry={isSecureTextHidden}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        
        {icon && iconPosition === 'right' && (
          <Ionicons name={icon} size={20} color={colors.text.secondary} style={styles.rightIcon} />
        )}
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setIsSecureTextHidden(!isSecureTextHidden)}
          >
            <Ionicons
              name={isSecureTextHidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Typography variant="caption" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: colors.primary.DEFAULT,
  },
  inputContainerError: {
    borderColor: colors.status.error,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
  },
  errorText: {
    color: colors.status.error,
    marginTop: 4,
  },
});