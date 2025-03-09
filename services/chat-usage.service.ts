import { supabase } from '@/lib/supabase/client';
import { storage } from '@/lib/utils/storage';

/**
 * チャット使用量管理サービス
 * 無料ユーザーのチャット使用制限を管理する
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
   * チャットが使用可能かチェック
   */
  public async canUseChat(userId: string): Promise<boolean> {
    try {
      // プレミアムユーザーかどうかチェック
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // プレミアムユーザーは制限なし
      if (profile.is_premium) {
        return true;
      }
      
      // 使用量データを取得
      const { data, error } = await supabase
        .from('chat_usage')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      // データがなければ初期化
      if (error && error.code === 'PGRST116') {
        await this.initUsage(userId);
        return true;
      } else if (error) {
        throw error;
      }
      
      // 最終リセットから24時間経過しているかチェック
      const lastReset = new Date(data.last_reset);
      const now = new Date();
      const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceReset >= 24) {
        // 24時間経過していればリセット
        await this.resetUsage(userId);
        return true;
      }
      
      // 制限内かチェック
      return data.day_count < data.day_limit;
    } catch (error) {
      console.error('チャット使用量チェックエラー:', error);
      
      // オフラインの場合はローカルデータを使用
      const dayCount = storage.getNumber('chat_day_count') ?? 0;
      const dayLimit = storage.getNumber('chat_day_limit') ?? 5;
      const lastResetStr = storage.getString('chat_last_reset');
      
      if (lastResetStr) {
        const lastReset = new Date(lastResetStr);
        const now = new Date();
        const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceReset >= 24) {
          // ローカルでリセット
          storage.set('chat_day_count', 0);
          storage.set('chat_last_reset', now.toISOString());
          return true;
        }
      }
      
      return dayCount < dayLimit;
    }
  }
  
  /**
   * 使用回数をインクリメント
   */
  public async incrementUsage(userId: string): Promise<void> {
    try {
      // プレミアムユーザーかどうかチェック
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // プレミアムユーザーはカウントしない
      if (profile.is_premium) {
        return;
      }
      
      // 現在の使用量を取得
      const { data, error } = await supabase
        .from('chat_usage')
        .select('day_count')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // データがなければ初期化
        await this.initUsage(userId, 1);
        return;
      } else if (error) {
        throw error;
      }
      
      // 使用回数をインクリメント
      const { error: updateError } = await supabase
        .from('chat_usage')
        .update({ day_count: data.day_count + 1 })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // ローカルストレージも更新
      const currentCount = storage.getNumber('chat_day_count') ?? 0;
      storage.set('chat_day_count', currentCount + 1);
    } catch (error) {
      console.error('使用回数インクリメントエラー:', error);
      
      // オフラインの場合はローカルだけ更新
      const currentCount = storage.getNumber('chat_day_count') ?? 0;
      storage.set('chat_day_count', currentCount + 1);
    }
  }
  
  /**
   * 使用量データの初期化
   */
  private async initUsage(userId: string, initialCount: number = 0): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('chat_usage')
        .insert({
          user_id: userId,
          day_count: initialCount,
          day_limit: 5, // 無料ユーザーの制限
          last_reset: now
        });
      
      if (error) throw error;
      
      // ローカルストレージも更新
      storage.set('chat_day_count', initialCount);
      storage.set('chat_day_limit', 5);
      storage.set('chat_last_reset', now);
    } catch (error) {
      console.error('使用量初期化エラー:', error);
    }
  }
  
  /**
   * 使用量のリセット
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
}