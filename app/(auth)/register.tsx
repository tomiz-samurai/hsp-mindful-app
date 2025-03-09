import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuth';
import { Typography } from '@/components/ui/atoms/Typography';
import { Button } from '@/components/ui/atoms/Button';
import { TextInput } from '@/components/ui/atoms/TextInput';
import { colors } from '@/styles/theme/colors';

/**
 * 新規登録画面
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 新規登録処理
  const handleRegister = async () => {
    // 入力検証
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }
    
    if (!password) {
      setError('パスワードを入力してください');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { success, error } = await signUp(email, password);
      
      if (success) {
        // 成功メッセージを表示
        // 注: 実際にはメール確認などの処理が必要かもしれません
        router.push('/login');
      } else if (error) {
        setError(error);
      }
    } catch (err) {
      setError('登録中にエラーが発生しました');
      console.error('Registration error:', err);
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
            新規アカウント登録
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            HSP Mindfulで心の安らぎを見つけましょう
          </Typography>
        </View>
        
        {/* 登録フォーム */}
        <View style={styles.formContainer}>
          {error && (
            <Typography variant="caption" style={styles.errorText}>
              {error}
            </Typography>
          )}
          
          <TextInput
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          
          <TextInput
            placeholder="パスワード"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          
          <TextInput
            placeholder="パスワード（確認）"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
          
          <Button
            onPress={handleRegister}
            style={styles.registerButton}
            loading={isLoading}
            disabled={isLoading}
          >
            アカウント作成
          </Button>
        </View>
        
        {/* ログインリンク */}
        <View style={styles.loginContainer}>
          <Typography variant="body" style={styles.loginText}>
            すでにアカウントをお持ちの方は
          </Typography>
          <Button
            variant="text"
            onPress={() => router.push('/login')}
          >
            ログイン
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
  registerButton: {
    marginTop: 8,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    marginBottom: 8,
    color: colors.text.secondary,
  },
  errorText: {
    color: colors.status.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});