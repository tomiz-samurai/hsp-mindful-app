import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useSession } from '@/hooks/auth/useSession';
import { storage } from '@/lib/utils/storage';

/**
 * チャット使用制限を管理するカスタムフック
 */
export const useChatLimits = () => {
  const { user, isPremium } = useSession();
  const [dayCount, setDayCount] = useState(0);
  const [dayLimit, setDayLimit] = useState(5); // 非プレミアムユーザーの1日の制限
  const [lastReset, setLastReset] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 使用量データの取得
  useEffect(() => {
    const fetchUsage = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // 使用量データの取得
        const { data, error } = await supabase
          .from('chat_usage')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // 'PGRST116' は「データが見つからない」エラー
          throw error;
        }
        
        // データがあれば状態を更新
        if (data) {
          setDayCount(data.day_count);
          setDayLimit(data.day_limit);
          setLastReset(data.last_reset);
          
          // 最終リセットから24時間以上経過していれば、カウントをリセット
          const resetTime = new Date(data.last_reset);
          const now = new Date();
          const hoursSinceReset = (now.getTime() - resetTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceReset >= 24) {
            await resetCount();
          }
        } else {
          // 初めての使用の場合、レコードを作成
          await initializeUsage();
        }
      } catch (error) {
        console.error('使用量データ取得エラー:', error);
        
        // オフラインの場合はキャッシュから読み込む
        const cachedCount = storage.getNumber('chat_day_count') ?? 0;
        const cachedLimit = storage.getNumber('chat_day_limit') ?? 5;
        const cachedReset = storage.getString('chat_last_reset');
        
        setDayCount(cachedCount);
        setDayLimit(cachedLimit);
        setLastReset(cachedReset || null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsage();
  }, [user]);
  
  // ローカルキャッシュの更新
  useEffect(() => {
    if (dayCount !== undefined) {
      storage.set('chat_day_count', dayCount);
    }
    if (dayLimit !== undefined) {
      storage.set('chat_day_limit', dayLimit);
    }
    if (lastReset) {
      storage.set('chat_last_reset', lastReset);
    }
  }, [dayCount, dayLimit, lastReset]);
  
  // 初期使用量データの作成
  const initializeUsage = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_usage')
        .insert({
          user_id: user.id,
          day_count: 0,
          day_limit: 5,
          last_reset: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setDayCount(data.day_count);
      setDayLimit(data.day_limit);
      setLastReset(data.last_reset);
    } catch (error) {
      console.error('使用量初期化エラー:', error);
    }
  };
  
  // 使用回数のリセット
  const resetCount = async () => {
    if (!user) return;
    
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('chat_usage')
        .update({
          day_count: 0,
          last_reset: now
        })
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setDayCount(data.day_count);
      setLastReset(data.last_reset);
      
      // ローカルキャッシュも更新
      storage.set('chat_day_count', 0);
      storage.set('chat_last_reset', now);
    } catch (error) {
      console.error('使用量リセットエラー:', error);
    }
  };
  
  // 使用回数のインクリメント
  const incrementCount = async () => {
    if (!user) return;
    
    try {
      const newCount = dayCount + 1;
      
      const { data, error } = await supabase
        .from('chat_usage')
        .update({
          day_count: newCount
        })
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setDayCount(data.day_count);
      storage.set('chat_day_count', data.day_count);
    } catch (error) {
      console.error('使用量更新エラー:', error);
      
      // オフラインの場合はローカルでカウントを増やす
      const newCount = dayCount + 1;
      setDayCount(newCount);
      storage.set('chat_day_count', newCount);
    }
  };
  
  // 残りのメッセージ数を取得
  const getRemainingMessages = useCallback(() => {
    if (isPremium) return Infinity;
    return Math.max(0, dayLimit - dayCount);
  }, [isPremium, dayLimit, dayCount]);
  
  // メッセージを送信できるかどうかをチェック
  const canSendMessage = useCallback(() => {
    if (isPremium) return true;
    return dayCount < dayLimit;
  }, [isPremium, dayCount, dayLimit]);
  
  return {
    dayCount,
    dayLimit,
    lastReset,
    isLoading,
    getRemainingMessages,
    canSendMessage,
    incrementCount
  };
};
