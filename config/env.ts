/**
 * 環境変数の設定
 * アプリが使用する環境変数を一元管理
 */

// Supabase設定
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Claude API設定
export const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || '';

// Expoプロジェクト設定
export const EXPO_PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID || '';

// IAP (In-App Purchase)設定
export const IAP_SKUS_IOS = [
  'com.tomizsamurai.hspmindfulapp.monthly',
  'com.tomizsamurai.hspmindfulapp.yearly',
];

export const IAP_SKUS_ANDROID = [
  'hsp_mindful_app_monthly',
  'hsp_mindful_app_yearly',
];

export const PREMIUM_MONTHLY_SKU_IOS = 'com.tomizsamurai.hspmindfulapp.monthly';
export const PREMIUM_YEARLY_SKU_IOS = 'com.tomizsamurai.hspmindfulapp.yearly';
export const PREMIUM_MONTHLY_SKU_ANDROID = 'hsp_mindful_app_monthly';
export const PREMIUM_YEARLY_SKU_ANDROID = 'hsp_mindful_app_yearly';

// アプリのバージョン情報
export const APP_VERSION = '1.0.0';

// ビルド環境の判定
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
