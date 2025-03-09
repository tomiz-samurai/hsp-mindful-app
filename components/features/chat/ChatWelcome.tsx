import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/atoms/Typography';
import { colors } from '@/styles/theme/colors';

interface ChatWelcomeProps {
  onEmotionSelect: (emotion: string) => void;
}

/**
 * チャットの初期ウェルカム画面
 * 感情選択ボタンを表示して会話のきっかけを提供
 */
export const ChatWelcome = ({ onEmotionSelect }: ChatWelcomeProps) => {
  // よくある感情リスト
  const commonEmotions = [
    '嬉しい', '楽しい', '穏やか', 'リラックス',
    '疲れた', '不安', '悲しい', '混乱', 'イライラ', '緊張'
  ];
  
  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title}>
        こんにちは！
      </Typography>
      
      <Typography variant="body" style={styles.welcomeText}>
        ミミです。今日はどのようにお手伝いできますか？
        何でもお気軽にお話ください。
      </Typography>
      
      <Typography variant="subtitle" style={styles.promptTitle}>
        今日の気分は？
      </Typography>
      
      <View style={styles.emotionsContainer}>
        {commonEmotions.map((emotion) => (
          <TouchableOpacity
            key={emotion}
            style={styles.emotionButton}
            onPress={() => onEmotionSelect(emotion)}
          >
            <Typography variant="button" style={styles.emotionText}>
              {emotion}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
      
      <Typography variant="body" style={styles.tipsText}>
        または、以下について質問してみてください：
      </Typography>
      
      <View style={styles.tipsContainer}>
        <Typography variant="caption" style={styles.tipItem}>
          • HSPとの上手な付き合い方
        </Typography>
        <Typography variant="caption" style={styles.tipItem}>
          • 感覚過敏の緩和方法
        </Typography>
        <Typography variant="caption" style={styles.tipItem}>
          • 刺激の多い環境での対処法
        </Typography>
        <Typography variant="caption" style={styles.tipItem}>
          • 瞑想やリラクゼーションのコツ
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background.tertiary,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    color: colors.primary.dark,
  },
  welcomeText: {
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text.primary,
  },
  promptTitle: {
    marginBottom: 12,
    textAlign: 'center',
    color: colors.text.primary,
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emotionButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  emotionText: {
    color: colors.primary.DEFAULT,
    fontSize: 14,
  },
  tipsText: {
    marginBottom: 8,
    color: colors.text.primary,
  },
  tipsContainer: {
    paddingLeft: 8,
  },
  tipItem: {
    marginBottom: 4,
    color: colors.text.secondary,
  },
});
