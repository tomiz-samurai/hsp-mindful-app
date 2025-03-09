import React, { useState } from 'react';
import { Image, View, ActivityIndicator, StyleSheet, ImageSourcePropType } from 'react-native';
import { useTheme } from 'react-native-paper';

interface OptimizedImageProps {
  source: ImageSourcePropType;
  fallbackSource?: ImageSourcePropType;
  lowResSource?: ImageSourcePropType;
  style?: any;
  loadingColor?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

/**
 * パフォーマンス最適化された画像コンポーネント
 * HSPアプリの静かなUI体験に合わせた読み込み体験を提供
 */
export const OptimizedImage = ({
  source,
  fallbackSource,
  lowResSource,
  style,
  loadingColor,
  resizeMode = 'cover',
  ...rest
}: OptimizedImageProps) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // 画像読み込み完了
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  // 画像読み込みエラー
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  return (
    <View style={[styles.container, style]}>
      {/* 低解像度プレースホルダー画像 */}
      {lowResSource && isLoading && (
        <Image
          source={lowResSource}
          style={[styles.image, { resizeMode }]}
          {...rest}
        />
      )}
      
      {/* メイン画像 */}
      {!hasError ? (
        <Image
          source={source}
          style={[
            styles.image, 
            { resizeMode },
            isLoading && lowResSource && styles.loadingImage
          ]}
          onLoad={handleLoad}
          onError={handleError}
          {...rest}
        />
      ) : fallbackSource ? (
        // エラー時のフォールバック画像
        <Image
          source={fallbackSource}
          style={[styles.image, { resizeMode }]}
          {...rest}
        />
      ) : (
        // フォールバック画像がなければプレースホルダー
        <View style={[styles.image, styles.placeholder]}/>
      )}
      
      {/* ローディングインジケーター */}
      {isLoading && !lowResSource && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="small"
            color={loadingColor || colors.primary}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingImage: {
    opacity: 0,
    position: 'absolute',
  },
  placeholder: {
    backgroundColor: '#E0E0E0',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});
