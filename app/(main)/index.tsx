import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/hooks/auth/useSession';
import { useMeditationProgress } from '@/hooks/data/useMeditationProgress';
import { useBreathingExercises } from '@/hooks/data/useBreathingExercises';
import { Typography } from '@/components/ui/atoms/Typography';
import { DailyMoodTracker } from '@/components/features/mood/DailyMoodTracker';
import { QuickAccessCard } from '@/components/ui/molecules/QuickAccessCard';
import { RecentSessionCard } from '@/components/features/meditation/RecentSessionCard';
import { HomeGreeting } from '@/components/features/home/HomeGreeting';
import { PremiumBanner } from '@/components/features/premium/PremiumBanner';

/**
 * ホーム画面
 * ユーザーの活動概要とクイックアクセス機能を表示
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { profile, isPremium } = useSession();
  const { availableSessions, getCompletedSessions } = useMeditationProgress();
  const { availableExercises } = useBreathingExercises();
  
  const completedSessions = getCompletedSessions();
  const recentSessions = availableSessions.slice(0, 3);
  
  return (
    <ScrollView
      className="flex-1 bg-background-primary"
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      {/* グリーティングセクション */}
      <HomeGreeting profile={profile} />
      
      {/* 気分トラッカー */}
      <View className="px-4 mb-6">
        <Typography variant="subtitle" className="mb-2">今日の気分は？</Typography>
        <DailyMoodTracker />
      </View>
      
      {/* クイックアクセス */}
      <View className="px-4 mb-6">
        <Typography variant="subtitle" className="mb-2">クイックアクセス</Typography>
        <View className="flex-row flex-wrap">
          <QuickAccessCard
            title="ミミと話す"
            icon="chatbubble-ellipses-outline"
            route="/chat"
            color="#62A5BF"
          />
          <QuickAccessCard
            title="瞑想する"
            icon="moon-outline"
            route="/mindfulness/meditation"
            color="#9B7E6B"
          />
          <QuickAccessCard
            title="呼吸法"
            icon="leaf-outline"
            route="/mindfulness/breathing"
            color="#F4A261"
          />
          <QuickAccessCard
            title="環境音"
            icon="musical-notes-outline"
            route="/mindfulness/sounds"
            color="#7FB69F"
          />
        </View>
      </View>
      
      {/* 最近のセッション */}
      {recentSessions.length > 0 && (
        <View className="px-4 mb-6">
          <Typography variant="subtitle" className="mb-2">おすすめセッション</Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentSessions.map((session) => (
              <RecentSessionCard
                key={session.id}
                session={session}
                style={{ marginRight: 12, width: 160 }}
              />
            ))}
          </ScrollView>
        </View>
      )}
      
      {/* プレミアムバナー */}
      {!isPremium && (
        <View className="px-4 mb-6">
          <PremiumBanner />
        </View>
      )}
      
      {/* 進捗サマリー */}
      <View className="px-4 mb-4">
        <Typography variant="subtitle" className="mb-2">あなたの進捗</Typography>
        <View className="bg-background-secondary rounded-lg p-4">
          <View className="flex-row justify-between mb-3">
            <Typography variant="body">完了した瞑想</Typography>
            <Typography variant="body" className="font-medium">
              {completedSessions.length}セッション
            </Typography>
          </View>
          <View className="flex-row justify-between mb-3">
            <Typography variant="body">利用可能な瞑想</Typography>
            <Typography variant="body" className="font-medium">
              {availableSessions.length}セッション
            </Typography>
          </View>
          <View className="flex-row justify-between">
            <Typography variant="body">利用可能な呼吸法</Typography>
            <Typography variant="body" className="font-medium">
              {availableExercises.length}種類
            </Typography>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}