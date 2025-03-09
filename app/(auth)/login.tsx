import React, { useState } from 'react';
import { View, Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
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
    
    setError(null);
    setIsLoading(true);
    
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.content}>
        {/* ロゴ */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/app-logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Typography variant="h2" style={styles.title}>
            HSPマインドフルアプリ
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            心の静けさを取り戻すためのあなたの場所
          </Typography>
        </View>
        
        {/* ログインフォーム */}
        <View style={styles.form}>
          <TextInput
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            style={styles.input}
          />
          
          <TextInput
            placeholder="パスワード"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
            style={styles.input}
          />
          
          {error && (
            <Typography variant="caption" style={styles.errorText}>
              {error}
            </Typography>
          )}
          
          <Button 
            onPress={handleLogin} 
            fullWidth 
            loading={isLoading}
            style={styles.loginButton}
          >
            ログイン
          </Button>
          
          <TouchableOpacity 
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotPasswordLink}
          >
            <Typography variant="caption" style={styles.forgotPasswordText}>
              パスワードをお忘れですか？
            </Typography>
          </TouchableOpacity>
        </View>
        
        {/* 登録リンク */}
        <View style={styles.registerContainer}>
          <Typography variant="body">
            アカウントをお持ちでないですか？
          </Typography>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Typography variant="body" style={styles.registerLink}>
              新規登録
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 24,
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
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: colors.status.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 8,
  },
  forgotPasswordLink: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  forgotPasswordText: {
    color: colors.primary.DEFAULT,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerLink: {
    color: colors.primary.DEFAULT,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});