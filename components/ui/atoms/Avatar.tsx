import React from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { Typography } from './Typography';
import { colors } from '@/styles/theme/colors';

interface AvatarProps {
  size?: number;
  source?: ImageSourcePropType;
  fallback?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * アバターコンポーネント
 * ユーザープロフィール画像や代替テキストを表示
 */
export const Avatar = ({ size = 40, source, fallback, style }: AvatarProps) => {
  // 画像を表示する場合
  if (source) {
    return (
      <Image
        source={source}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ]}
      />
    );
  }
  
  // 代替テキストを表示する場合
  return (
    <View
      style={[
        styles.avatar,
        styles.fallbackContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Typography
        style={[
          styles.fallbackText,
          {
            fontSize: size * 0.4,
          },
        ]}
      >
        {fallback || '?'}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.gray[200],
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
  },
  fallbackText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
