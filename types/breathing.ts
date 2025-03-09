/**
 * 呼吸法機能の型定義
 */

// 呼吸法エクササイズの型
export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  type: BreathingExerciseType;
  settings: BreathingSettings;
  is_premium: boolean;
  cover_image_url: string;
  created_at: string;
  updated_at: string;
  sort_order: number;
}

// 呼吸法の設定
export interface BreathingSettings {
  inhale: number; // 吸う時間（秒）
  hold: number; // 止める時間（秒）
  exhale: number; // 吐く時間（秒）
  holdAfterExhale?: number; // 吐いた後に止める時間（秒）（ボックス呼吸法用）
  cyclesForCompletion: number; // 完了までのサイクル数
}

// 呼吸法のタイプ
export type BreathingExerciseType = 
  | '4-7-8' // 4-7-8呼吸法
  | 'box' // ボックス呼吸法
  | 'grounding'; // グラウンディング呼吸法

// 呼吸フェーズ
export type BreathingPhase = 
  | 'inhale' // 吸う
  | 'hold' // 止める
  | 'exhale' // 吐く
  | 'holdAfterExhale' // 吐いた後に止める（ボックス呼吸法用）
  | 'prepare' // 準備
  | 'complete'; // 完了

// 呼吸法の進捗
export interface BreathingProgress {
  id: string;
  user_id: string;
  exercise_id: string;
  completed_cycles: number;
  last_practiced_at: string | null;
  created_at: string;
  updated_at: string;
}
