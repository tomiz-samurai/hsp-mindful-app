import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/auth/useSession';
import { AIService } from '@/services/ai.service';
import { Message } from '@/types/chat';
import { storage } from '@/lib/utils/storage';

/**
 * チャットメッセージを管理するカスタムフック
 * オンライン/オフライン状態を考慮し、メッセージの同期も行う
 */
export const useChatMessages = (conversationId?: string) => {
  const { user } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  
  const aiService = AIService.getInstance();
  
  // 会話履歴の取得
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !currentConversationId) return;
      
      try {
        setIsLoading(true);
        const history = await aiService.getConversationHistory(currentConversationId);
        setMessages(history);
      } catch (error) {
        console.error('メッセージ取得エラー:', error);
        // オフラインの場合はローカルキャッシュから取得
        const cachedMessages = storage.getObject<Message[]>(`chat_${currentConversationId}`);
        if (cachedMessages) {
          setMessages(cachedMessages);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [user, currentConversationId]);
  
  // メッセージのローカルキャッシュ
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      storage.set(`chat_${currentConversationId}`, messages);
    }
  }, [messages, currentConversationId]);
  
  // メッセージの追加
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);
  
  // AIへのメッセージ送信
  const sendToAI = useCallback(async (text: string) => {
    if (!user) throw new Error('ユーザーがログインしていません');
    
    let activeConversationId = currentConversationId;
    
    try {
      setIsProcessing(true);
      
      // 会話IDがなければ新しい会話を作成
      if (!activeConversationId) {
        const conversation = await aiService.createConversation(user.id);
        activeConversationId = conversation.id;
        setCurrentConversationId(activeConversationId);
      }
      
      // AIにメッセージを送信
      const response = await aiService.sendMessage(
        user.id,
        activeConversationId,
        text,
        messages
      );
      
      return response;
    } catch (error) {
      console.error('AI送信エラー:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [user, messages, currentConversationId]);
  
  return {
    messages,
    addMessage,
    isLoading,
    isProcessing,
    sendToAI,
    conversationId: currentConversationId,
  };
};
