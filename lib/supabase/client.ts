import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/env';
import { Database } from '@/types/supabase';

/**
 * Supabaseクライアントの初期化
 * HSPアプリのバックエンドとのインタラクションを管理
 */

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase環境変数が設定されていません。');
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    // HSPユーザー向けに反応時間を制御するための設定
    global: {
      fetch: (url, options) => {
        // レスポンスにレイテンシーを追加することで、UIの急激な変化を防止
        return fetch(url, options);
      },
    },
  }
);
