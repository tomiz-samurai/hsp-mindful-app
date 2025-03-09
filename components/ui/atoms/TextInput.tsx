import React, { forwardRef } from 'react';
import { 
  TextInput as RNTextInput, 
  TextInputProps as RNTextInputProps, 
  StyleSheet, 
  View,
  Text,
  StyleProp,
  ViewStyle
} from 'react-native';
import { colors } from '@/styles/theme/colors';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * テキスト入力コンポーネント
 * HSPアプリのスタイルに合わせたカスタムテキスト入力
 */
export const TextInput = forwardRef<RNTextInput, TextInputProps>((
  { label, error, style, ...rest },
  ref
) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null
      ]}>
        <RNTextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={colors.text.tertiary}
          {...rest}
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontFamily: 'NotoSansJP-Medium',
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    overflow: 'hidden',
  },
  input: {
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 16,
    color: colors.text.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  errorText: {
    fontFamily: 'NotoSansJP-Regular',
    fontSize: 12,
    color: colors.status.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

TextInput.displayName = 'TextInput';