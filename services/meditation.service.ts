import { supabase } from '@/lib/supabase/client';
import { storage } from '@/lib/utils/storage';
import { MeditationSession, MeditationProgress } from '@/types/meditation';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

/**
 * 瞑想機能管理サービス
 * 瞑想セッションの取得、進捗管理、ダウンロードなどを担当
 */
export class MeditationService {
  private static instance: MeditationService;
  private readonly cacheKey = 'meditation_sessions';
  private readonly progressCacheKey = 'meditation_progress';
  
  private constructor() {}
  
  /**
   * シングルトンインスタンスの取得
   */
  public static getInstance(): MeditationService {
    if (!MeditationService.instance) {
      MeditationService.instance = new MeditationService();
    }
    return MeditationService.instance;
  }
  
  /**
   * 全瞑想セッションの取得
   */
  public async getAllSessions(): Promise<MeditationSession[]> {
    try {
      // オンラインからデータを取得
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      
      // キャッシュを更新
      this.cacheSessionData(data);
      
      return data;
    } catch (error) {
      console.error('瞑想セッション取得エラー:', error);
      
      // オフラインならキャッシュから取得
      const cachedData = this.getCachedSessionData();
      if (cachedData.length > 0) {
        return cachedData;
      }
      
      throw error;
    }
  }
  
  /**
   * セッションIDによるセッション取得
   */
  public async getSessionById(sessionId: string): Promise<MeditationSession | null> {
    try {
      // オンラインからデータを取得
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`セッションID[${sessionId}]取得エラー:`, error);
      
      // オフラインならキャッシュから検索
      const cachedData = this.getCachedSessionData();
      const cachedSession = cachedData.find(session => session.id === sessionId);
      
      return cachedSession || null;
    }
  }
  
  /**
   * カテゴリ別のセッション取得
   */
  public async getSessionsByCategory(category: string): Promise<MeditationSession[]> {
    try {
      // オンラインからデータを取得
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('category', category)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`カテゴリ[${category}]のセッション取得エラー:`, error);
      
      // オフラインならキャッシュから検索
      const cachedData = this.getCachedSessionData();
      return cachedData.filter(session => session.category === category);
    }
  }
  
  /**
   * ユーザー進捗の取得
   */
  public async getUserProgress(userId: string): Promise<MeditationProgress[]> {
    try {
      // オンラインからデータを取得
      const { data, error } = await supabase
        .from('meditation_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // キャッシュを更新
      this.cacheProgressData(data);
      
      return data;
    } catch (error) {
      console.error('瞑想進捗取得エラー:', error);
      
      // オフラインならキャッシュから取得
      const cachedData = this.getCachedProgressData();
      return cachedData;
    }
  }
  
  /**
   * 進捗の更新
   */
  public async updateProgress(
    userId: string,
    sessionId: string,
    durationSeconds: number,
    completed: boolean
  ): Promise<MeditationProgress> {
    try {
      // 既存の進捗を確認
      const { data: existingData, error: existingError } = await supabase
        .from('meditation_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('session_id', sessionId)
        .maybeSingle();
      
      if (existingError && existingError.code !== 'PGRST116') throw existingError;
      
      const now = new Date().toISOString();
      let progressData;
      
      if (existingData) {
        // 既存データの更新
        const newCompleted = completed || existingData.completed;
        const newDuration = Math.max(durationSeconds, existingData.duration_seconds);
        
        const { data, error } = await supabase
          .from('meditation_progress')
          .update({
            duration_seconds: newDuration,
            completed: newCompleted,
            completed_at: newCompleted && !existingData.completed ? now : existingData.completed_at,
            updated_at: now
          })
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) throw error;
        progressData = data;
      } else {
        // 新規データの作成
        const { data, error } = await supabase
          .from('meditation_progress')
          .insert({
            user_id: userId,
            session_id: sessionId,
            duration_seconds: durationSeconds,
            completed,
            completed_at: completed ? now : null
          })
          .select()
          .single();
        
        if (error) throw error;
        progressData = data;
      }
      
      // キャッシュも更新
      const cachedProgress = this.getCachedProgressData();
      const updatedCache = cachedProgress.filter(p => 
        !(p.user_id === userId && p.session_id === sessionId)
      );
      updatedCache.push(progressData);
      this.cacheProgressData(updatedCache);
      
      return progressData;
    } catch (error) {
      console.error('進捗更新エラー:', error);
      
      // オフライン時はローカルのみ更新
      const progress: MeditationProgress = {
        id: `local-${Date.now()}`,
        user_id: userId,
        session_id: sessionId,
        duration_seconds: durationSeconds,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const cachedProgress = this.getCachedProgressData();
      const updatedCache = cachedProgress.filter(p => 
        !(p.user_id === userId && p.session_id === sessionId)
      );
      updatedCache.push(progress);
      this.cacheProgressData(updatedCache);
      
      return progress;
    }
  }
  
  /**
   * 音声ファイルのダウンロードとキャッシュ
   */
  public async downloadAudio(audioUrl: string): Promise<string> {
    // Expo FileSystemがサポートされているか確認
    if (!FileSystem.documentDirectory) {
      return audioUrl;
    }
    
    try {
      // ファイル名の生成
      const fileName = audioUrl.split('/').pop() || `audio-${Date.now()}.mp3`;
      const localUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // ファイルが既にダウンロード済みかチェック
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      
      if (fileInfo.exists) {
        return localUri;
      }
      
      // ファイルをダウンロード
      const downloadResult = await FileSystem.downloadAsync(
        audioUrl,
        localUri
      );
      
      if (downloadResult.status === 200) {
        return localUri;
      } else {
        throw new Error(`ダウンロードエラー: ${downloadResult.status}`);
      }
    } catch (error) {
      console.error('音声ダウンロードエラー:', error);
      // エラー時は元のURLを返す
      return audioUrl;
    }
  }
  
  /**
   * セッションデータのキャッシュ
   */
  private cacheSessionData(data: MeditationSession[]) {
    storage.set(this.cacheKey, data);
  }
  
  /**
   * キャッシュからセッションデータを取得
   */
  private getCachedSessionData(): MeditationSession[] {
    return storage.getObject<MeditationSession[]>(this.cacheKey) || [];
  }
  
  /**
   * 進捗データのキャッシュ
   */
  private cacheProgressData(data: MeditationProgress[]) {
    storage.set(this.progressCacheKey, data);
  }
  
  /**
   * キャッシュから進捗データを取得
   */
  private getCachedProgressData(): MeditationProgress[] {
    return storage.getObject<MeditationProgress[]>(this.progressCacheKey) || [];
  }
}