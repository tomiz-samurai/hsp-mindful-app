import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChatMessages } from '@/hooks/data/useChatMessages';
import { useChatLimits } from '@/hooks/data/useChatLimits';
import { useSession } from '@/hooks/auth/useSession';
import { MessageBubble } from '@/components/ui/molecules/MessageBubble';
import { Typography } from '@/components/ui/atoms/Typography';
import { OwlCharacter } from '@/components/features/chat/OwlCharacter';
import { colors } from '@/styles/theme/colors';
import { Message } from '@/types/chat';

/**
 * チャット画面
 * ユーザーはフクロウキャラクター（ミミ）とチャットできます
 */
export default function ChatScreen() {
  const { isPremium } = useSession();
  const { messages, addMessage, isLoading, isProcessing, sendToAI } = useChatMessages();
  const { canSendMessage, getRemainingMessages } = useChatLimits();
  const [inputText, setInputText] = useState('');
  const [owlEmotion, setOwlEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'concerned'>('neutral');
  const flatListRef = useRef<FlatList>(null);
  
  // メッセージが更新されたらスクロールする
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);
  
  // 処理状態に基づいてフクロウの感情を更新
  useEffect(() => {
    if (isProcessing) {
      setOwlEmotion('thinking');
    } else if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'owl') {
        setOwlEmotion(Math.random() > 0.5 ? 'happy' : 'neutral');
      }
    }
  }, [isProcessing, messages]);
  
  // メッセージ送信
  const handleSendMessage = async () => {
    if (!inputText.trim() || !canSendMessage() || isProcessing) return;
    
    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    addMessage(userMessage);
    setInputText('');
    
    try {
      // AIサービスにメッセージを送信
      const response = await sendToAI(inputText.trim());
      
      // AIレスポンスを追加
      const owlMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'owl',
        timestamp: new Date().toISOString(),
      };
      
      addMessage(owlMessage);
    } catch (error) {
      console.error('AIメッセージ送信エラー:', error);
      
      // エラーメッセージを追加
      addMessage({
        id: (Date.now() + 1).toString(),
        text: 'すみません、うまく応答できませんでした。もう一度お試しください。',
        sender: 'owl',
        timestamp: new Date().toISOString(),
        isError: true,
      });
    }
  };
  
  // 感情選択ボタンクリック時
  const handleEmotionSelect = (emotion: string) => {
    setInputText(`今日は${emotion}気分です`);
  };
  
  // ウェルカム画面表示
  const renderWelcomeScreen = () => (
    <View style={styles.welcomeContainer}>
      <Typography variant="subtitle" style={styles.welcomeTitle}>
        ミミといつでもお話しできます
      </Typography>
      <Typography variant="body" style={styles.welcomeText}>
        感情や悩みを気軽に共有してみましょう。
        ミミはHSPの特性を理解し、あなたに寄り添います。
      </Typography>
      
      <Typography variant="subtitle" style={styles.emotionTitle}>
        今日の気分は？
      </Typography>
      <View style={styles.emotionButtonsContainer}>
        {['嬉しい', '悲しい', '疲れた', '不安', 'リラックス'].map((emotion) => (
          <TouchableOpacity
            key={emotion}
            style={styles.emotionButton}
            onPress={() => handleEmotionSelect(emotion)}
          >
            <Typography variant="caption">{emotion}</Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  // 残りメッセージ数の表示（非プレミアム用）
  const renderRemainingMessages = () => {
    if (isPremium) return null;
    
    const remaining = getRemainingMessages();
    return (
      <View style={styles.remainingContainer}>
        <Typography variant="caption" style={styles.remainingText}>
          今日の残りメッセージ: {remaining}
        </Typography>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* ヘッダー */}
        <View style={styles.header}>
          <Typography variant="h3">
            ミミ
          </Typography>
        </View>
        
        {/* フクロウキャラクター */}
        <View style={styles.owlContainer}>
          <OwlCharacter emotion={owlEmotion} isProcessing={isProcessing} />
        </View>
        
        {/* メッセージリスト */}
        {messages.length === 0 ? (
          renderWelcomeScreen()
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isUser={item.sender === 'user'}
              />
            )}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
          />
        )}
        
        {/* 残りメッセージ表示 */}
        {renderRemainingMessages()}
        
        {/* メッセージ入力 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="メッセージを入力..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, 
              (!inputText.trim() || !canSendMessage() || isProcessing) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || !canSendMessage() || isProcessing}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  owlContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  welcomeContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text.secondary,
  },
  emotionTitle: {
    marginTop: 16,
    marginBottom: 12,
  },
  emotionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emotionButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  remainingContainer: {
    padding: 8,
    alignItems: 'center',
  },
  remainingText: {
    color: colors.text.secondary,
  },
});