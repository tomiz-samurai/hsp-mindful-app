import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/hooks/auth/useSession';
import { useAuth } from '@/hooks/auth/useAuth';
import { Typography } from '@/components/ui/atoms/Typography';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { PremiumStatusBadge } from '@/components/features/premium/PremiumStatusBadge';
import { SettingsItem } from '@/components/ui/molecules/SettingsItem';

/**
 * ユーザープロフィールと設定画面
 */
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, isPremium } = useSession();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // ログアウト処理
  const handleLogout = async () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              const { success } = await signOut();
              if (!success) {
                throw new Error('ログアウトに失敗しました');
              }
            } catch (error) {
              Alert.alert('エラー', '正常にログアウトできませんでした。もう一度お試しください。');
              console.error('ログアウトエラー:', error);
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };
  
  return (
    <ScrollView
      className="flex-1 bg-background-primary"
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      {/* プロフィールヘッダー */}
      <View className="items-center pt-6 pb-4">
        <Avatar
          size={80}
          source={{ uri: profile?.avatar_url }}
          fallback={profile?.display_name?.[0] || profile?.username?.[0] || 'U'}
        />
        <Typography variant="h3" className="mt-2 mb-1">
          {profile?.display_name || profile?.username || 'ユーザー'}
        </Typography>
        <View className="flex-row items-center">
          <PremiumStatusBadge isPremium={isPremium} />
        </View>
      </View>
      
      {/* アカウント設定 */}
      <View className="mb-6">
        <Typography variant="subtitle" className="px-4 mb-2">アカウント設定</Typography>
        <View className="bg-background-secondary rounded-lg mx-4">
          <SettingsItem
            icon="person-outline"
            title="プロフィール編集"
            onPress={() => router.push('/profile/edit')}
          />
          <SettingsItem
            icon="notifications-outline"
            title="通知設定"
            onPress={() => router.push('/profile/notifications')}
          />
          {!isPremium && (
            <SettingsItem
              icon="star-outline"
              title="プレミアムプラン"
              onPress={() => router.push('/premium')}
              rightIcon={
                <Ionicons name="chevron-forward" size={20} color="#9B7E6B" />
              }
            />
          )}
        </View>
      </View>
      
      {/* アプリ設定 */}
      <View className="mb-6">
        <Typography variant="subtitle" className="px-4 mb-2">アプリ設定</Typography>
        <View className="bg-background-secondary rounded-lg mx-4">
          <SettingsItem
            icon="color-palette-outline"
            title="テーマ設定"
            onPress={() => router.push('/profile/theme')}
          />
          <SettingsItem
            icon="language-outline"
            title="言語設定"
            onPress={() => router.push('/profile/language')}
          />
          <SettingsItem
            icon="help-circle-outline"
            title="ヘルプ"
            onPress={() => router.push('/help')}
          />
        </View>
      </View>
      
      {/* その他 */}
      <View className="mb-6">
        <Typography variant="subtitle" className="px-4 mb-2">その他</Typography>
        <View className="bg-background-secondary rounded-lg mx-4">
          <SettingsItem
            icon="document-text-outline"
            title="利用規約"
            onPress={() => router.push('/terms')}
          />
          <SettingsItem
            icon="shield-outline"
            title="プライバシーポリシー"
            onPress={() => router.push('/privacy')}
          />
          <SettingsItem
            icon="information-circle-outline"
            title="アプリについて"
            onPress={() => router.push('/about')}
          />
          <SettingsItem
            icon="log-out-outline"
            title="ログアウト"
            onPress={handleLogout}
            isLoading={isLoggingOut}
          />
        </View>
      </View>
    </ScrollView>
  );
}