import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/atoms/Typography';
import { OptimizedImage } from '@/components/ui/atoms/OptimizedImage';
import { MeditationSession } from '@/types/meditation';
import { colors } from '@/styles/theme/colors';

interface MeditationCardProps {
  session: MeditationSession;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  completed?: boolean;
  isLocked?: boolean;
}

/**
 * 瞑想セッションカードコンポーネント
 * 瞑想一覧画面で表示されるセッションのカード
 */
export const MeditationCard = ({ 
  session, 
  onPress, 
  style,
  completed = false,
  isLocked = false
}: MeditationCardProps) => {
  // 時間のフォーマット
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分`;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={isLocked ? undefined : onPress}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <OptimizedImage 
          source={{ uri: session.cover_image_url }} 
          fallbackSource={require('@/assets/images/meditation-placeholder.jpg')}
          style={styles.image}
        />
        
        {/* グラデーションオーバーレイ */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        
        {/* 錠アイコン（プレミアムコンテンツ） */}
        {isLocked && (
          <View style={styles.lockedOverlay}>
            <Ionicons name="lock-closed" size={24} color="white" />
            <Typography variant="caption" style={styles.lockedText}>
              プレミアム
            </Typography>
          </View>
        )}
        
        {/* 完了バッジ */}
        {completed && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={24} color={colors.status.success} />
          </View>
        )}
        
        {/* 再生ボタン */}
        <View style={styles.playButton}>
          <Ionicons name="play" size={20} color="white" />
        </View>
        
        {/* 再生時間 */}
        <View style={styles.durationBadge}>
          <Typography variant="caption" style={styles.durationText}>
            {formatDuration(session.duration)}
          </Typography>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Typography variant="subtitle" numberOfLines={1} style={styles.title}>
          {session.title}
        </Typography>
        <Typography variant="caption" numberOfLines={2} style={styles.description}>
          {session.description}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    color: colors.text.secondary,
  },
  playButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: 'white',
    marginTop: 4,
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});
