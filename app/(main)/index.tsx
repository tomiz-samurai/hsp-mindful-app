import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@/hooks/auth/useSession';
import { Typography } from '@/components/ui/atoms/Typography';
import { colors } from '@/styles/theme/colors';

/**
 * ホーム画面
 * アプリの主要機能へのアクセスとステータスの概要を提供
 */
export default function HomeScreen() {
  const router = useRouter();
  const { profile, isPremium } = useSession();
  
  // 現在の時間に基づく挨拶
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'おはようございます';
    if (hour < 18) return 'こんにちは';
    return 'こんばんは';
  };
  
  // ユーザー名の取得（表示名またはユーザー名、どちらもなければ「お客様」）
  const getUserName = () => {
    if (!profile) return 'お客様';
    return profile.display_name || profile.username || 'お客様';
  };
  
  // クイックアクセスボタン
  const QuickAccessButton = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.quickAccessButton} onPress={onPress}>
      <View style={styles.quickAccessIconContainer}>
        <Ionicons name={icon} size={24} color={colors.primary.DEFAULT} />
      </View>
      <Typography variant="caption" style={styles.quickAccessTitle}>
        {title}
      </Typography>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* ヘッダー部 */}
        <View style={styles.header}>
          <View>
            <Typography variant="h2" style={styles.greeting}>
              {getGreeting()}
            </Typography>
            <Typography variant="subtitle" style={styles.userName}>
              {getUserName()}さん
            </Typography>
          </View>
          
          {/* プレミアムバッジ */}
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={16} color="white" />
              <Typography variant="caption" style={styles.premiumText}>
                プレミアム
              </Typography>
            </View>
          )}
        </View>
        
        {/* 気分トラッカー */}
        <View style={styles.moodSection}>
          <Typography variant="subtitle" style={styles.sectionTitle}>
            今日の気分は？
          </Typography>
          <View style={styles.moodButtonsContainer}>
            {['嬉しい', '元気', 'リラックス', '疲れた', '不安', '悲しい'].map((mood) => (
              <TouchableOpacity 
                key={mood} 
                style={styles.moodButton}
                onPress={() => router.push(`/chat?mood=${mood}`)}
              >
                <Typography variant="caption">{mood}</Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* クイックアクセス */}
        <View style={styles.quickAccessSection}>
          <Typography variant="subtitle" style={styles.sectionTitle}>
            クイックアクセス
          </Typography>
          <View style={styles.quickAccessGrid}>
            <QuickAccessButton 
              title="ミミと話す" 
              icon="chatbubble-ellipses-outline" 
              onPress={() => router.push('/chat')} 
            />
            <QuickAccessButton 
              title="瞑想する" 
              icon="moon-outline" 
              onPress={() => router.push('/mindfulness/meditation')} 
            />
            <QuickAccessButton 
              title="呼吸法" 
              icon="leaf-outline" 
              onPress={() => router.push('/mindfulness/breathing')} 
            />
            <QuickAccessButton 
              title="環境音" 
              icon="musical-notes-outline" 
              onPress={() => router.push('/mindfulness/sounds')} 
            />
          </View>
        </View>
        
        {/* おすすめ瞑想 */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeaderWithLink}>
            <Typography variant="subtitle" style={styles.sectionTitle}>
              おすすめ瞑想
            </Typography>
            <TouchableOpacity onPress={() => router.push('/mindfulness/meditation')}>
              <Typography variant="caption" style={styles.seeAllLink}>
                すべて見る
              </Typography>
            </TouchableOpacity>
          </View>
          
          {/* おすすめ瞑想カード（サンプル） */}
          <TouchableOpacity 
            style={styles.recommendedCard}
            onPress={() => router.push('/mindfulness/meditation/1')}
          >
            <View style={styles.recommendedCardImagePlaceholder}>
              <Ionicons name="moon" size={30} color="white" />
            </View>
            <View style={styles.recommendedCardContent}>
              <Typography variant="subtitle" style={styles.recommendedCardTitle}>
                HSP向け瞑想
              </Typography>
              <Typography variant="caption" style={styles.recommendedCardDescription}>
                感覚過負荷からの回復に効果的な10分間の瞑想です
              </Typography>
              <View style={styles.recommendedCardMeta}>
                <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
                <Typography variant="caption" style={styles.recommendedCardDuration}>
                  10分
                </Typography>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* 非プレミアムユーザー向けのプロモーション */}
        {!isPremium && (
          <TouchableOpacity 
            style={styles.premiumPromoCard}
            onPress={() => router.push('/premium')}
          >
            <View style={styles.premiumPromoContent}>
              <Typography variant="subtitle" style={styles.premiumPromoTitle}>
                HSPプレミアムを試してみませんか？
              </Typography>
              <Typography variant="caption" style={styles.premiumPromoDescription}>
                瞑想や呼吸法の全コンテンツにアクセス、ミミとの無制限会話など
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    marginBottom: 4,
  },
  userName: {
    color: colors.text.secondary,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary.DEFAULT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  premiumText: {
    color: 'white',
    marginLeft: 4,
  },
  moodSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  moodButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moodButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  quickAccessSection: {
    marginBottom: 24,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  quickAccessButton: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  quickAccessIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  quickAccessTitle: {
    textAlign: 'center',
  },
  recommendedSection: {
    marginBottom: 24,
  },
  sectionHeaderWithLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllLink: {
    color: colors.primary.DEFAULT,
  },
  recommendedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recommendedCardImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedCardContent: {
    flex: 1,
    padding: 12,
  },
  recommendedCardTitle: {
    marginBottom: 4,
  },
  recommendedCardDescription: {
    color: colors.text.secondary,
    marginBottom: 8,
  },
  recommendedCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedCardDuration: {
    color: colors.text.secondary,
    marginLeft: 4,
  },
  premiumPromoCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  premiumPromoContent: {
    flex: 1,
  },
  premiumPromoTitle: {
    marginBottom: 4,
  },
  premiumPromoDescription: {
    color: colors.text.secondary,
  },
});