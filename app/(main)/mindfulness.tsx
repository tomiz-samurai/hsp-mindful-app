import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMeditationProgress } from '@/hooks/data/useMeditationProgress';
import { useBreathingExercises } from '@/hooks/data/useBreathingExercises';
import { useSounds } from '@/hooks/data/useSounds';
import { Typography } from '@/components/ui/atoms/Typography';
import { MeditationCard } from '@/components/features/meditation/MeditationCard';
import { BreathingCard } from '@/components/features/breathing/BreathingCard';
import { SoundCategoryCard } from '@/components/features/sounds/SoundCategoryCard';
import { CategoryHeader } from '@/components/ui/molecules/CategoryHeader';

/**
 * マインドフルネス＆リラクゼーション機能のメイン画面
 */
export default function MindfulnessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { availableSessions } = useMeditationProgress();
  const { availableExercises } = useBreathingExercises();
  const { availableSounds, getSoundsByCategory } = useSounds();
  
  // 各カテゴリーの代表的なアイテムを取得
  const featuredMeditations = availableSessions.slice(0, 2);
  const featuredBreathing = availableExercises.slice(0, 2);
  
  // サウンドのカテゴリー一覧
  const soundCategories = [...new Set(availableSounds.map(sound => sound.category))];
  
  return (
    <ScrollView
      className="flex-1 bg-background-primary"
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      {/* 瞑想セクション */}
      <View className="mb-6">
        <CategoryHeader
          title="瞑想"
          icon="moon-outline"
          onViewAll={() => router.push('/mindfulness/meditation')}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {featuredMeditations.map((session) => (
            <MeditationCard
              key={session.id}
              session={session}
              onPress={() => router.push(`/mindfulness/meditation/${session.id}`)}
              style={{ marginRight: 12, width: 180 }}
            />
          ))}
        </ScrollView>
      </View>
      
      {/* 呼吸法セクション */}
      <View className="mb-6">
        <CategoryHeader
          title="呼吸法"
          icon="leaf-outline"
          onViewAll={() => router.push('/mindfulness/breathing')}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {featuredBreathing.map((exercise) => (
            <BreathingCard
              key={exercise.id}
              exercise={exercise}
              onPress={() => router.push(`/mindfulness/breathing/${exercise.id}`)}
              style={{ marginRight: 12, width: 180 }}
            />
          ))}
        </ScrollView>
      </View>
      
      {/* サウンドセクション */}
      <View className="mb-6">
        <CategoryHeader
          title="環境音"
          icon="musical-notes-outline"
          onViewAll={() => router.push('/mindfulness/sounds')}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {soundCategories.map((category) => (
            <SoundCategoryCard
              key={category}
              category={category}
              count={getSoundsByCategory(category).length}
              onPress={() => router.push(`/mindfulness/sounds?category=${category}`)}
              style={{ marginRight: 12, width: 140 }}
            />
          ))}
        </ScrollView>
      </View>
      
      {/* ミキサーセクション */}
      <View className="px-4 mb-6">
        <Typography variant="subtitle" className="mb-2">サウンドミキサー</Typography>
        <View 
          className="bg-background-secondary rounded-lg p-4 items-center"
          style={{ aspectRatio: 2 }}
        >
          <Typography variant="body" className="text-center mb-2">
            複数の環境音を組み合わせて、あなただけのサウンドスケープを作成しましょう
          </Typography>
          <View 
            className="bg-primary px-4 py-2 rounded-full"
            onTouchEnd={() => router.push('/mindfulness/sounds/mixer')}
          >
            <Typography variant="button" className="text-white">
              ミキサーを開く
            </Typography>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}