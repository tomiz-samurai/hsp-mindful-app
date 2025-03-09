import { supabase } from '@/lib/supabase/client';
import { storage } from '@/lib/utils/storage';

/**
 * チャット使用量管理サービスクラス
 * 非プレミアムユーザーのチャット使用制限を管理
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
   * チャットを使用できるかどうかチェック
   */
  public async canUseChat(userId: string): Promise<boolean> {
    try {
      // プレミアムユーザーかチェック
      const isPremium = await this.isUserPremium(userId);
      if (isPremium) {
        return true; // プレミアムユーザーは制限なし
      }
      
      // 当日の使用量を取得
      const usage = await this.getDailyUsage(userId);
      
      // 最終リセットから24時間以上経過していればリセット
      if (this.shouldResetDailyCount(usage.lastReset)) {
        await this.resetDailyCount(userId);
        return true;
      }
      
      // 制限内かチェック
      return usage.dayCount < usage.dayLimit;
    } catch (error) {
      console.error('使用制限チェックエラー:', error);
      
      // オフラインの場合はローカルキャッシュから確認
      const isPremium = storage.getBoolean('is_premium') ?? false;
      if (isPremium) return true;
      
      const dayCount = storage.getNumber('chat_day_count') ?? 0;
      const dayLimit = storage.getNumber('chat_day_limit') ?? 5;
      const lastReset = storage.getString('chat_last_reset');
      
      if (lastReset && this.shouldResetDailyCount(lastReset)) {
        storage.set('chat_day_count', 0);
        storage.set('chat_last_reset', new Date().toISOString());
        return true;
      }
      
      return dayCount < dayLimit;
    }
  }
  
  /**
   * ユーザーがプレミアムかチェック
   */
  private async isUserPremium(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return data.is_premium || false;
    } catch (error) {
      console.error('プレミアムチェックエラー:', error);
      return storage.getBoolean('is_premium') ?? false;
    }
  }
  
  /**
   * 日次の使用量を取得
   */
  private async getDailyUsage(userId: string): Promise<{
    dayCount: number;
    dayLimit: number;
    lastReset: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('chat_usage')
        .select('day_count, day_limit, last_reset')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        // レコードがない場合は新規作成
        if (error.code === 'PGRST116') {
          const newUsage = await this.initializeUsage(userId);
          return newUsage;
        }
        throw error;
      }
      
      return {
        dayCount: data.day_count,
        dayLimit: data.day_limit,
        lastReset: data.last_reset
      };
    } catch (error) {
      console.error('使用量取得エラー:', error);
      
      // オフライン時はローカルキャッシュから取得
      return {
        dayCount: storage.getNumber('chat_day_count') ?? 0,
        dayLimit: storage.getNumber('chat_day_limit') ?? 5,
        lastReset: storage.getString('chat_last_reset') ?? new Date().toISOString()
      };
    }
  }
  
  /**
   * 利用記録の新規作成
   */
  private async initializeUsage(userId: string): Promise<{
    dayCount: number;
    dayLimit: number;
    lastReset: string;
  }> {
    const now = new Date().toISOString();
    
    try {
      const { data, error } = await supabase
        .from('chat_usage')
        .insert({
          user_id: userId,
          day_count: 0,
          day_limit: 5, // 非プレミアムのデフォルト制限
          last_reset: now
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        dayCount: data.day_count,
        dayLimit: data.day_limit,
        lastReset: data.last_reset
      };
    } catch (error) {
      console.error('使用量初期化エラー:', error);
      
      // オフライン時のフォールバック
      storage.set('chat_day_count', 0);
      storage.set('chat_day_limit', 5);
      storage.set('chat_last_reset', now);
      
      return {
        dayCount: 0,
        dayLimit: 5,
        lastReset: now
      };
    }
  }
  
  /**
   * 日次カウントをリセットする必要があるかチェック
   */
  private shouldResetDailyCount(lastReset: string): boolean {
    const resetTime = new Date(lastReset);
    const now = new Date();
    const hoursSinceReset = (now.getTime() - resetTime.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceReset >= 24;
  }
  
  /**
   * 日次カウントのリセット
   */
  private async resetDailyCount(userId: string): Promise<void> {
    const now = new Date().toISOString();
    
    try {
      const { error } = await supabase
        .from('chat_usage')
        .update({
          day_count: 0,
          last_reset: now
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // ローカルキャッシュも更新
      storage.set('chat_day_count', 0);
      storage.set('chat_last_reset', now);
    } catch (error) {
      console.error('日次カウントリセットエラー:', error);
    }
  }
  
  /**
   * 使用回数のインクリメント
   */
  public async incrementUsage(userId: string): Promise<void> {
    try {
      // 現在の使用量を取得
      const usage = await this.getDailyUsage(userId);
      
      // 最終リセットから24時間以上経過していればリセット
      if (this.shouldResetDailyCount(usage.lastReset)) {
        await this.resetDailyCount(userId);
        usage.dayCount = 0;
      }
      
      // 使用回数をインクリメント
      const newCount = usage.dayCount + 1;
      
      const { error } = await supabase
        .from('chat_usage')
        .update({
          day_count: newCount
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // ローカルキャッシュも更新
      storage.set('chat_day_count', newCount);
    } catch (error) {
      console.error('使用量インクリメントエラー:', error);
      
      // オフライン時はローカルから取得してインクリメント
      const currentCount = storage.getNumber('chat_day_count') ?? 0;
      storage.set('chat_day_count', currentCount + 1);
    }
  }
}