import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
  withRepeat,
  cancelAnimation,
} from 'react-native-reanimated';
import { Typography } from '@/components/ui/atoms/Typography';
import { colors } from '@/styles/theme/colors';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale' | 'prepare' | 'complete';

interface BreathingGuideProps {
  exerciseType: '4-7-8' | 'box' | 'grounding';
  isActive: boolean;
  onPhaseChange?: (phase: BreathingPhase) => void;
  onComplete?: () => void;
}

/**
 * 呼吸法ガイドコンポーネント
 * アニメーション付きの呼吸法ガイドを提供
 */
export const BreathingGuide = ({
  exerciseType,
  isActive,
  onPhaseChange,
  onComplete
}: BreathingGuideProps) => {
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('prepare');
  const [countdown, setCountdown] = useState(3);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  
  // アニメーション値
  const circleScale = useSharedValue(1);
  const circleOpacity = useSharedValue(0.7);
  
  // 呼吸法の設定
  const breathingSettings = {
    '4-7-8': {
      inhale: 4,
      hold: 7,
      exhale: 8,
      cyclesForCompletion: 4
    },
    'box': {
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4,
      cyclesForCompletion: 4
    },
    'grounding': {
      inhale: 5,
      hold: 2,
      exhale: 6,
      cyclesForCompletion: 5
    }
  };
  
  const settings = breathingSettings[exerciseType];
  
  // フェーズの指示テキスト
  const phaseInstructions = {
    prepare: '準備...',
    inhale: '吸う...',
    hold: '止める...',
    exhale: '吐く...',
    holdAfterExhale: '止める...',
    complete: '完了！よくできました'
  };
  
  // 活性化状態が変化したとき
  useEffect(() => {
    // アニメーションをリセット
    cancelAnimation(circleScale);
    cancelAnimation(circleOpacity);
    
    // 活性化状態によってフェーズを変更
    if (isActive) {
      setCurrentPhase('prepare');
      setCountdown(3);
      setCyclesCompleted(0);
      circleScale.value = 1;
      circleOpacity.value = 0.7;
    } else {
      // 計測完了時にコンポーネントが非活性化された場合の処理
      if (currentPhase === 'complete' && onComplete) {
        onComplete();
      }
    }
  }, [isActive]);
  
  // フェーズ変更時の処理
  useEffect(() => {
    if (onPhaseChange) {
      onPhaseChange(currentPhase);
    }
    
    // 最初の準備フェーズ
    if (currentPhase === 'prepare' && isActive) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCurrentPhase('inhale');
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
    
    // 各フェーズのアニメーションとタイマー
    if (isActive && currentPhase !== 'prepare' && currentPhase !== 'complete') {
      // フェーズに応じたアニメーション
      switch (currentPhase) {
        case 'inhale':
          // 吸うアニメーション
          circleScale.value = withTiming(1.5, {
            duration: settings.inhale * 1000,
            easing: Easing.inOut(Easing.quad)
          });
          circleOpacity.value = withTiming(1, {
            duration: settings.inhale * 1000
          });
          break;
          
        case 'exhale':
          // 吐くアニメーション
          circleScale.value = withTiming(1, {
            duration: settings.exhale * 1000,
            easing: Easing.inOut(Easing.quad)
          });
          circleOpacity.value = withTiming(0.7, {
            duration: settings.exhale * 1000
          });
          break;
          
        // holdとholdAfterExhaleは現在のスケールを維持
      }
      
      // 現在のフェーズの時間を取得
      const duration = settings[currentPhase] * 1000;
      
      // 次のフェーズに移行するタイマー
      const timer = setTimeout(() => {
        let nextPhase: BreathingPhase;
        let newCyclesCompleted = cyclesCompleted;
        
        // 次のフェーズを決定
        switch (currentPhase) {
          case 'inhale':
            nextPhase = 'hold';
            break;
          case 'hold':
            nextPhase = 'exhale';
            break;
          case 'exhale':
            if (exerciseType === 'box') {
              nextPhase = 'holdAfterExhale';
            } else {
              newCyclesCompleted = cyclesCompleted + 1;
              nextPhase = newCyclesCompleted >= settings.cyclesForCompletion ? 'complete' : 'inhale';
            }
            break;
          case 'holdAfterExhale':
            newCyclesCompleted = cyclesCompleted + 1;
            nextPhase = newCyclesCompleted >= settings.cyclesForCompletion ? 'complete' : 'inhale';
            break;
          default:
            nextPhase = 'inhale';
        }
        
        // サイクル数と次のフェーズを更新
        setCyclesCompleted(newCyclesCompleted);
        setCurrentPhase(nextPhase);
        
        // 完了時の処理
        if (nextPhase === 'complete' && onComplete) {
          // 完了アニメーション
          circleScale.value = withSequence(
            withTiming(1.2, { duration: 300 }),
            withTiming(1, { duration: 300 })
          );
          
          // 完了コールバックを少し遅らせて呼び出す
          setTimeout(() => {
            if (isActive && onComplete) {
              onComplete();
            }
          }, 1500);
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [currentPhase, isActive, exerciseType]);
  
  // アニメーションのスタイル
  const circleAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: circleScale.value }],
      opacity: circleOpacity.value
    };
  });
  
  // フェーズに基づいた色を設定
  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return colors.primary.DEFAULT;
      case 'hold':
      case 'holdAfterExhale':
        return colors.secondary.DEFAULT;
      case 'exhale':
        return colors.accent.DEFAULT;
      case 'complete':
        return colors.status.success;
      default:
        return colors.primary.light;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* アニメーションサークル */}
      <Animated.View
        style={[
          styles.circle,
          circleAnimationStyle,
          { backgroundColor: getPhaseColor() }
        ]}
      >
        <View style={styles.contentContainer}>
          {currentPhase === 'prepare' ? (
            <Typography variant="h2" style={styles.countdownText}>
              {countdown}
            </Typography>
          ) : (
            <Typography variant="body" style={styles.phaseText}>
              {phaseInstructions[currentPhase]}
            </Typography>
          )}
        </View>
      </Animated.View>
      
      {/* 現在のフェーズとサイクル情報 */}
      {isActive && currentPhase !== 'prepare' && currentPhase !== 'complete' && (
        <View style={styles.infoContainer}>
          <Typography variant="caption" style={styles.cycleText}>
            サイクル: {cyclesCompleted + 1}/{settings.cyclesForCompletion}
          </Typography>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  phaseText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  cycleText: {
    color: colors.text.secondary,
  },
});
