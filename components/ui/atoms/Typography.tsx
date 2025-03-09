import React, { ReactNode } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { typography } from '@/styles/theme/typography';

type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'subtitle' 
  | 'body' 
  | 'caption' 
  | 'small' 
  | 'button';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  children: ReactNode;
}

/**
 * タイポグラフィコンポーネント
 * HSPアプリの統一されたテキスト表示を提供
 */
export const Typography = ({
  variant = 'body',
  style,
  children,
  ...rest
}: TypographyProps) => {
  const variantStyle = typography.style[variant];
  
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: variantStyle.fontSize,
          fontWeight: variantStyle.fontWeight,
          lineHeight: variantStyle.fontSize * variantStyle.lineHeight,
          letterSpacing: variantStyle.letterSpacing,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'NotoSansJP-Regular',
  },
});
