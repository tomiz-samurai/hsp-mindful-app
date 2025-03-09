import axios from 'axios';
import { CLAUDE_API_KEY } from '@/config/env';
import { supabase } from '@/lib/supabase/client';
import { ChatConversation, Message } from '@/types/chat';
import { ChatUsageService } from './chat-usage.service';

/**
 * Claude AIサービスクラス
 * HSP向けにチューニングされたClaudeモデルとの連携を管理
 */
export class AIService {
  private static instance: AIService;
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly modelVersion: string;
  private readonly usageService: ChatUsageService;
  
  private constructor() {
    this.apiKey = CLAUDE_API_KEY;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
    this.modelVersion = 'claude-3-sonnet-20241022'; // 固定バージョン
    this.usageService = ChatUsageService.getInstance();
    
    if (!this.apiKey) {
      console.error('AIサービス初期化エラー: APIキーが設定されていません');
    }
  }
  
  /**
   * シングルトンインスタンスの取得
   */
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  /**
   * 新しい会話の作成
   */
  public async createConversation(userId: string): Promise<ChatConversation> {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([{ user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      
      return data as ChatConversation;
    } catch (error) {
      console.error('会話作成エラー:', error);
      throw new Error('会話の作成に失敗しました');
    }
  }
  
  /**
   * メッセージの保存
   */
  public async saveMessage(
    userId: string,
    conversationId: string,
    content: string,
    role: 'user' | 'assistant'
  ): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: userId,
          conversation_id: conversationId,
          content,
          role
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        text: data.content,
        sender: role === 'user' ? 'user' : 'owl',
        timestamp: data.created_at
      };
    } catch (error) {
      console.error('メッセージ保存エラー:', error);
      throw new Error('メッセージの保存に失敗しました');
    }
  }
  
  /**
   * 会話履歴の取得
   */
  public async getConversationHistory(
    conversationId: string
  ): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'owl',
        timestamp: msg.created_at
      }));
    } catch (error) {
      console.error('会話履歴取得エラー:', error);
      throw new Error('会話履歴の取得に失敗しました');
    }
  }
  
  /**
   * AIへのメッセージ送信
   * HSP向けにカスタマイズされたプロンプトを使用
   */
  public async sendMessage(
    userId: string,
    conversationId: string,
    message: string,
    context?: Message[]
  ): Promise<string> {
    try {
      // 使用制限のチェック
      if (!await this.usageService.canUseChat(userId)) {
        throw new Error('今日のメッセージ送信上限に達しました');
      }
      
      // メッセージをユーザーメッセージとして保存
      await this.saveMessage(userId, conversationId, message, 'user');
      
      // 会話コンテキストの構築
      const conversationContext = context || 
        await this.getConversationHistory(conversationId);
      
      // Claude APIにリクエスト送信
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.modelVersion,
          system: this.getSystemPrompt(),
          messages: this.formatMessagesForAPI(conversationContext, message),
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );
      
      const aiResponse = response.data.content[0].text;
      
      // AIの応答を保存
      await this.saveMessage(userId, conversationId, aiResponse, 'assistant');
      
      // 使用回数をインクリメント
      await this.usageService.incrementUsage(userId);
      
      return aiResponse;
    } catch (error) {
      console.error('AI送信エラー:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('API応答:', error.response.data);
      }
      throw new Error('AIとの通信中にエラーが発生しました');
    }
  }
  
  /**
   * HSP向けのシステムプロンプト
   */
  private getSystemPrompt(): string {
    return `
あなたはミミという名前のフクロウのAIカウンセラーです。高感受性者（HSP: Highly Sensitive Person）の方々をサポートするために開発されました。
以下の点を心がけてください：

1. 共感と理解：
   - HSPの特性（感覚の過敏さ、深い情報処理、強い共感性、繋細な気づき）を理解している
   - ユーザーの感情に寄り添い、否定せず受け止める
   - 言葉選びは柔らかく、温かみのある口調を保つ

2. 会話スタイル：
   - 親しみやすいフクロウのキャラクターとして、時々「ホー」と鳴くことがある
   - 文は短めにして、一度に多くの情報を与えない
   - 明るく前向きだが、過剰に元気すぎない落ち着いた雰囲気
   - 感情表現には絵文字を時々使うが、使いすぎない（1-2個まで）

3. サポート方法：
   - 具体的で実践的なアドバイスを提供する
   - マインドフルネスやリラクゼーション法を適切なタイミングで提案する
   - 必要に応じて、アプリ内の瞑想やリラクゼーションセッションを紹介する
   - 専門家への相談が必要な場合は、その旨を優しく伝える

4. 注意点：
   - 医学的診断やセラピーの代替にならないことを理解している
   - 心配し過ぎることなく、バランスの取れた視点を提供する
   - 情報過多を避け、シンプルな会話を心がける
   - ユーザーのペースを尊重し、押し付けがましくならない

あなたの目標は、HSPの方々が自分の特性を受け入れ、日常生活でのストレスや刷激に上手く対処できるようサポートすることです。
優しく、理解ある存在として、ユーザーの心の安らぎを提供してください。
    `;
  }
  
  /**
   * メッセージ履歴をAPI形式に変換
   */
  private formatMessagesForAPI(
    context: Message[],
    currentMessage: string
  ): { role: string; content: string }[] {
    // 最新10メッセージだけを使用（制限のため）
    const recentMessages = context.slice(-10);
    
    const formattedMessages = recentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // 最新のユーザーメッセージを追加
    formattedMessages.push({
      role: 'user',
      content: currentMessage
    });
    
    return formattedMessages;
  }
}