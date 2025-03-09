import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuth';
import { Typography } from '@/components/ui/atoms/Typography';
import { Button } from '@/components/ui/atoms/Button';
import { TextInput } from '@/components/ui/atoms/TextInput';
import { colors } from '@/styles/theme/colors';

/**
 * パスワードリセット画面
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // パスワードリセットメール送信処理
  const handleResetPassword = async () => {
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { success, error } = await resetPassword(email);
      
      if (success) {
        setSuccess(true);
      } else if (error) {
        setError(error);
      }
    } catch (err) {
      setError('パスワードリセット処理中にエラーが発生しました');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* タイトル */}
        <View style={styles.headerContainer}>
          <Typography variant="h2" style={styles.title}>
            パスワードをリセット
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            登録したメールアドレスを入力してください
          </Typography>
        </View>
        
        {/* リセットフォーム */}
        <View style={styles.formContainer}>
          {error && (
            <Typography variant="caption" style={styles.errorText}>
              {error}
            </Typography>
          )}
          
          {success && (
            <View style={styles.successContainer}>
              <Typography variant="body" style={styles.successText}>
                パスワードリセットの手順をメールで送信しました。
                メールをご確認ください。
              </Typography>
            </View>
          )}
          
          <TextInput
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          
          <Button
            onPress={handleResetPassword}
            style={styles.resetButton}
            loading={isLoading}
            disabled={isLoading || success}
          >
            リセットリンクを送信
          </Button>
        </View>
        
        {/* ログインリンク */}
        <View style={styles.loginContainer}>
          <Button
            variant="text"
            onPress={() => router.push('/login')}
          >
            ログイン画面に戻る
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    color: colors.primary.dark,
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 8,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    color: colors.status.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: colors.status.success,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: 'white',
    textAlign: 'center',
  },
});