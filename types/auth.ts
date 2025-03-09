/**
 * 認証関連の型定義
 */

// ユーザープロファイル
export interface Profile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  is_premium: boolean;
  premium_until?: string;
  notification_preferences?: {
    meditation: boolean;
    breathing: boolean;
    sound: boolean;
    chat: boolean;
  };
}

// ユーザー
export interface User {
  id: string;
  aud: string;
  email?: string;
  created_at: string;
  role?: string;
}

// サブスクリプション
export interface Subscription {
  id: string;
  user_id: string;
  subscription_type: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'expired';
  start_date: string;
  end_date: string;
  provider: 'apple' | 'google';
  provider_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

// 認証状態
export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}
