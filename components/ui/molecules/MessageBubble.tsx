import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../atoms/Typography';
import { Avatar } from '../atoms/Avatar';
import { colors } from '@/styles/theme/colors';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  onPress?: () => void;
}

/**
 * メッセージバブルコンポーネント
 * チャット画面でのメッセージ表示に使用
 */
export const MessageBubble = ({ message, isUser, onPress }: MessageBubbleProps) => {
  const formattedTime = formatMessageTime(message.timestamp);
  const isError = message.isError;
  
  const bubbleContent = (
    <>
      <Typography style={[
        styles.messageText,
        isUser ? styles.userMessageText : styles.owlMessageText,
        isError && styles.errorMessageText
      ]}>
        {message.text}
      </Typography>
      <Typography variant="small" style={styles.timeText}>
        {formattedTime}
      </Typography>
    </>
  );
  
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.owlContainer
    ]}>
      {!isUser && (
        <Avatar 
          size={36} 
          source={require('@/assets/images/owl-avatar.png')} 
          fallback="M"
          style={styles.avatar}
        />
      )}
      
      <View style={[styles.bubbleContainer, isUser ? styles.userBubbleContainer : styles.owlBubbleContainer]}>
        {onPress ? (
          <TouchableOpacity 
            style={[
              styles.bubble,
              isUser ? styles.userBubble : styles.owlBubble,
              isError && styles.errorBubble
            ]}
            onPress={onPress}
            activeOpacity={0.7}
          >
            {bubbleContent}
          </TouchableOpacity>
        ) : (
          <View style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.owlBubble,
            isError && styles.errorBubble
          ]}>
            {bubbleContent}
          </View>
        )}
      </View>
    </View>
  );
};

// メッセージの時間をフォーマットするヘルパー関数
const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  owlContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  bubbleContainer: {
    maxWidth: '80%',
  },
  userBubbleContainer: {
    alignItems: 'flex-end',
  },
  owlBubbleContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: colors.primary.DEFAULT,
    borderTopRightRadius: 4,
  },
  owlBubble: {
    backgroundColor: colors.background.tertiary,
    borderTopLeftRadius: 4,
  },
  errorBubble: {
    backgroundColor: colors.status.error,
  },
  messageText: {
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  owlMessageText: {
    color: colors.text.primary,
  },
  errorMessageText: {
    color: 'white',
  },
  timeText: {
    marginTop: 2,
    fontSize: 10,
    textAlign: 'right',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
