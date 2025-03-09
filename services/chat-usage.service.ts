import { supabase } from '@/lib/supabase/client';
import { storage } from '@/lib/utils/storage';

/**
 * チャット使用量サービスクラス
 * フリーユーザーのチャット使用制限を管理
 */
export class ChatUsageService {
  private static instance: ChatUsageService;
  
  private constructor() {}
  
  /**
   * シングルトンインスタンスの取得
   */
  public static getInstance(): ChatUsageService {
    if (!ChatUsageService.instance) {
      ChatUsageService.instance = new ChatUsageService();
    }
    return ChatUsageService.instance;
  }
  
  /**
   * ユーザーがチャットを使用できるかどうかを確認
   * プレミアムユーザーは無制限、フリーユーザーは1日の上限あり
   */
  public async canUseChat(userId: string): Promise<boolean> {
    try {
      // ユーザープロフィールを取得してプレミアムかどうかを確認
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // プレミアムユーザーは常に使用可能
      if (profileData.is_premium) {
        return true;
      }
      
      // 使用量を取得
      const { data, error } = await supabase
        .from('chat_usage')
        .select('day_count, day_limit, last_reset')
        .eq('user_id', userId)
        .single();
      
      // データがない場合は使用可能（初回使用）
      if (error && error.code === 'PGRST116') {
        return true;
      } else if (error) {
        throw error;
      }
      
      // 最終リセットから24時間以上経過しているかどうかを確認
      const lastReset = new Date(data.last_reset);
      const now = new Date();
      const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
      
      // 24時間以上経過していれば使用可能（カウントをリセットする）
      if (hoursSinceReset >= 24) {
        await this.resetUsage(userId);
        return true;
      }
      
      // 上限に達していなければ使用可能
      return data.day_count < data.day_limit;
    } catch (error) {
      console.error('チャット使用確認エラー:', error);
      
      // オフラインモードの処理
      // ローカルストレージから情報を取得
      const isPremium = storage.getBoolean('is_premium') || false;
      
      // プレミアムユーザーは常に使用可能
      if (isPremium) {
        return true;
      }
      
      const dayCount = storage.getNumber('chat_day_count') || 0;
      const dayLimit = storage.getNumber('chat_day_limit') || 5;
      const lastResetStr = storage.getString('chat_last_reset');
      
      // 最終リセット時間が記録されていない場合は使用可能
      if (!lastResetStr) {
        return true;
      }
      
      // 最終リセットから24時間以上経過しているかどうかを確認
      const lastReset = new Date(lastResetStr);
      const now = new Date();
      const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
      
      // 24時間以上経過していれば使用可能（ローカルのカウントをリセット）
      if (hoursSinceReset >= 24) {
        storage.set('chat_day_count', 0);
        storage.set('chat_last_reset', now.toISOString());
        return true;
      }
      
      // 上限に達していなければ使用可能
      return dayCount < dayLimit;
    }
  }
  
  /**
   * 使用回数をインクリメント
   */
  public async incrementUsage(userId: string): Promise<void> {
    try {
      // 現在の使用量を取得
      const { data, error } = await supabase
        .from('chat_usage')
        .select('day_count')
        .eq('user_id', userId)
        .single();
      
      // データがない場合は新しいレコードを作成
      if (error && error.code === 'PGRST116') {
        await this.initializeUsage(userId);
        return;
      } else if (error) {
        throw error;
      }
      
      // 使用量をインクリメント
      const { error: updateError } = await supabase
        .from('chat_usage')
        .update({ day_count: data.day_count + 1 })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // ローカルストレージも更新
      const currentCount = storage.getNumber('chat_day_count') || 0;
      storage.set('chat_day_count', currentCount + 1);
    } catch (error) {
      console.error('使用量インクリメントエラー:', error);
      
      // オフラインモードの処理
      const currentCount = storage.getNumber('chat_day_count') || 0;
      storage.set('chat_day_count', currentCount + 1);
    }
  }
  
  /**
   * 使用量のリセット（24時間経過時）
   */
  private async resetUsage(userId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('chat_usage')
        .update({
          day_count: 0,
          last_reset: now
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // ローカルストレージも更新
      storage.set('chat_day_count', 0);
      storage.set('chat_last_reset', now);
    } catch (error) {
      console.error('使用量リセットエラー:', error);
    }
  }
  
  /**
   * 初回使用時の使用量初期化
   */
  private async initializeUsage(userId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('chat_usage')
        .insert({
          user_id: userId,
          day_count: 1, // 初回使用なので1からスタート
          day_limit: 5, // フリーユーザーの1日の上限
          last_reset: now
        });
      
      if (error) throw error;
      
      // ローカルストレージも更新
      storage.set('chat_day_count', 1);
      storage.set('chat_day_limit', 5);
      storage.set('chat_last_reset', now);
    } catch (error) {
      console.error('使用量初期化エラー:', error);
    }
  }
}