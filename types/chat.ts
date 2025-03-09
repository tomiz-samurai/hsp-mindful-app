/**
 * チャット機能の型定義
 */

// メッセージの型
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'owl';
  timestamp: string;
  isError?: boolean;
}

// 会話の型
export interface ChatConversation {
  id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

// AIレスポンスの型
export interface AIResponse {
  message: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  suggestedAction?: 'meditation' | 'breathing' | 'sound' | null;
}
