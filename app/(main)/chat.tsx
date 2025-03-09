import React from 'react';
import { View } from 'react-native';
import { OwlChatInterface } from '@/components/features/chat/OwlChatInterface';
import { Typography } from '@/components/ui/atoms/Typography';

/**
 * フクロウAIカウンセラー（ミミ）のチャット画面
 */
export default function ChatScreen() {
  return (
    <View className="flex-1">
      <OwlChatInterface />
    </View>
  );
}