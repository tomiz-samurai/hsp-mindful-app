import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { colors } from '@/styles/theme/colors';

type OwlEmotion = 'neutral' | 'happy' | 'thinking' | 'concerned';

interface OwlCharacterProps {
  emotion?: OwlEmotion;
  isProcessing?: boolean;
  size?: number;
}

/**
 * フクロウキャラクターコンポーネント
 * HSPアプリのチャット画面で使用されるフクロウキャラクター
 */
export const OwlCharacter = ({ 
  emotion = 'neutral', 
  isProcessing = false,
  size = 120
}: OwlCharacterProps) => {
  // アニメーション値
  const bodyRotate = useSharedValue(0);
  const eyesScale = useSharedValue(1);
  const bubbleOpacity = useSharedValue(isProcessing ? 1 : 0);
  
  // 感情が変化したときにアニメーションを設定
  useAnimatedReaction(
    () => emotion,
    (currentEmotion, previousEmotion) => {
      if (currentEmotion !== previousEmotion) {
        // 既存のアニメーションをキャンセル
        cancelAnimation(bodyRotate);
        cancelAnimation(eyesScale);
        
        // 新しい感情に基づいたアニメーションを設定
        switch (currentEmotion) {
          case 'happy':
            bodyRotate.value = withRepeat(
              withTiming(0.05, { duration: 500, easing: Easing.inOut(Easing.quad) }),
              -1,
              true
            );
            eyesScale.value = withTiming(0.8, { duration: 300 });
            break;
          case 'thinking':
            bodyRotate.value = withTiming(0.05, { duration: 500 });
            eyesScale.value = withRepeat(
              withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
              -1,
              true
            );
            break;
          case 'concerned':
            bodyRotate.value = withTiming(-0.05, { duration: 500 });
            eyesScale.value = withTiming(1.2, { duration: 300 });
            break;
          default:
            bodyRotate.value = withTiming(0, { duration: 500 });
            eyesScale.value = withTiming(1, { duration: 300 });
        }
      }
    },
    [emotion]
  );
  
  // 処理状態が変化したときにアニメーションを設定
  useAnimatedReaction(
    () => isProcessing,
    (processing) => {
      bubbleOpacity.value = withTiming(processing ? 1 : 0, { duration: 300 });
    },
    [isProcessing]
  );
  
  // アニメーションスタイル
  const bodyStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${bodyRotate.value}rad` },
      ],
    };
  });
  
  const eyesStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleY: eyesScale.value },
      ],
    };
  });
  
  const bubbleStyle = useAnimatedStyle(() => {
    return {
      opacity: bubbleOpacity.value,
    };
  });
  
  // 感情に基づいた画像の選択
  const getOwlImage = () => {
    switch (emotion) {
      case 'happy':
        return require('@/assets/images/owl-happy.png');
      case 'thinking':
        return require('@/assets/images/owl-thinking.png');
      case 'concerned':
        return require('@/assets/images/owl-concerned.png');
      default:
        return require('@/assets/images/owl-neutral.png');
    }
  };
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 心を考えているバブル */}
      <Animated.View style={[styles.thinkingBubble, bubbleStyle]}>
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </Animated.View>
      
      {/* フクロウの体 */}
      <Animated.View style={[styles.body, bodyStyle]}>
        <Image 
          source={getOwlImage()} 
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
        
        {/* 目のアニメーション用オーバーレイ */}
        <Animated.View style={[styles.eyes, eyesStyle]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    position: 'relative',
  },
  eyes: {
    position: 'absolute',
    top: '40%',
    left: '25%',
    width: '50%',
    height: '10%',
    backgroundColor: 'transparent',
  },
  thinkingBubble: {
    position: 'absolute',
    top: 0,
    right: '10%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    zIndex: 10,
  },
});
