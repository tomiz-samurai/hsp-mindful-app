import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuth';
import { Typography } from '@/components/ui/atoms/Typography';
import { Button } from '@/components/ui/atoms/Button';
import { TextInput } from '@/components/ui/atoms/TextInput';
import { colors } from '@/styles/theme/colors';

/**
 * ログイン画面
 */
export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ログイン処理
  const handleLogin = async () => {
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { success, error } = await signIn(email, password);
      
      if (!success && error) {
        setError(error);
      }
    } catch (err) {
      setError('ログイン中にエラーが発生しました');
      console.error('Login error:', err);
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
        {/* ロゴとタイトル */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/owl-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Typography variant="h2" style={styles.title}>
            HSP Mindful
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            高感受性者のためのマインドフルネスアプリ
          </Typography>
        </View>
        
        {/* ログインフォーム */}
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
          
          <Button
            onPress={handleLogin}
            style={styles.loginButton}
            loading={isLoading}
            disabled={isLoading}
          >
            ログイン
          </Button>
          
          <Button
            variant="text"
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotButton}
          >
            パスワードをお忘れですか？
          </Button>
        </View>
        
        {/* 新規登録リンク */}
        <View style={styles.signupContainer}>
          <Typography variant="body" style={styles.signupText}>
            アカウントをお持ちでない方は
          </Typography>
          <Button
            variant="outline"
            onPress={() => router.push('/register')}
            style={styles.signupButton}
          >
            新規登録
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
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
  loginButton: {
    marginTop: 8,
  },
  forgotButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  signupContainer: {
    alignItems: 'center',
  },
  signupText: {
    marginBottom: 12,
    color: colors.text.secondary,
  },
  signupButton: {
    minWidth: 200,
  },
  errorText: {
    color: colors.status.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});