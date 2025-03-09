/**
 * サウンドセラピー機能の型定義
 */

// サウンドの型
export interface Sound {
  id: string;
  name: string;
  category: SoundCategory;
  audio_url: string;
  icon_url: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  sort_order: number;
}

// サウンドカテゴリーの型
export type SoundCategory = 
  | 'nature' // 自然音
  | 'ambient' // 環境音
  | 'instruments' // 楽器
  | 'whitenoise' // ホワイトノイズ
  | 'binaural'; // バイノーラル

// サウンドミックスの型
export interface SoundMix {
  id: string;
  name: string;
  createdAt: string;
  sounds: {
    soundId: string;
    volume: number;
  }[];
}

// サウンド続きの設定
export interface SoundPlaybackSettings {
  loop: boolean;
  volume: number;
  timerDuration?: number; // 分単位、スリープタイマー用
}
