/**
 * 瞑想機能の型定義
 */

// 瞑想セッションの型
export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // 秒単位
  category: string;
  audio_url: string;
  cover_image_url: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  sort_order: number;
}

// 瞑想進捗の型
export interface MeditationProgress {
  id: string;
  user_id: string;
  session_id: string;
  completed: boolean;
  completed_at: string | null;
  duration_seconds: number;
  created_at: string;
  updated_at: string;
}

// 瞑想カテゴリの型
export type MeditationCategory = 
  | 'beginner' // 初心者向け
  | 'anxiety' // 不安軽減
  | 'sleep' // 睡眠導入
  | 'morning' // 朝の活力
  | 'hsp' // HSP向け感覺過負荷リカバリー
  | 'focus' // 集中力
  | 'relaxation'; // リラクゼーション
