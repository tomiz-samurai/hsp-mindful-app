import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase/client';
import { storage } from '@/lib/utils/storage';
import { 
  IAP_SKUS_IOS, 
  IAP_SKUS_ANDROID,
  PREMIUM_MONTHLY_SKU_IOS,
  PREMIUM_YEARLY_SKU_IOS,
  PREMIUM_MONTHLY_SKU_ANDROID,
  PREMIUM_YEARLY_SKU_ANDROID
} from '@/config/constants';

export interface SubscriptionProduct {
  productId: string;
  price: string;
  title: string;
  description: string;
  currency: string;
  localizedPrice: string;
  subscriptionPeriod?: string;
  type: 'monthly' | 'yearly';
}

export interface SubscriptionPurchase {
  productId: string;
  transactionId: string;
  transactionDate: number;
  originalTransactionIdentifierForAndroid?: string;
}

/**
 * サブスクリプションサービスクラス
 * HSPアプリのプレミアム機能を管理するためのサービス
 */
export class SubscriptionService {
  private static instance: SubscriptionService;
  private isConnected: boolean = false;
  private products: SubscriptionProduct[] = [];
  
  private constructor() {}
  
  /**
   * シングルトンインスタンスの取得
   */
  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }
  
  /**
   * IAP (In-App Purchase) への接続
   */
  public async connect(): Promise<void> {
    try {
      if (this.isConnected) return;
      
      await InAppPurchases.connectAsync();
      this.isConnected = true;
      
      // 購入イベントリスナーの設定
      InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          results?.forEach(purchase => {
            this.handlePurchase(purchase);
          });
        } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          console.log('購入がユーザーによってキャンセルされました');
        } else {
          console.error('購入エラー:', errorCode);
        }
      });
    } catch (error) {
      console.error('IAP接続エラー:', error);
      throw error;
    }
  }
  
  /**
   * IAP接続の終了
   */
  public async disconnect(): Promise<void> {
    try {
      if (!this.isConnected) return;
      
      await InAppPurchases.disconnectAsync();
      this.isConnected = false;
    } catch (error) {
      console.error('IAP切断エラー:', error);
      throw error;
    }
  }
  
  /**
   * 購入可能な商品情報の取得
   */
  public async getProducts(): Promise<SubscriptionProduct[]> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      // 製品IDのリストを取得（プラットフォームに応じて）
      const skus = Platform.OS === 'ios' ? IAP_SKUS_IOS : IAP_SKUS_ANDROID;
      
      // 製品情報を取得
      const { responseCode, results, errorCode } = await InAppPurchases.getProductsAsync(skus);
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        // 製品情報を整形
        this.products = results.map(product => {
          // 月額か年額かの判定
          const isMonthly = 
            product.productId === PREMIUM_MONTHLY_SKU_IOS || 
            product.productId === PREMIUM_MONTHLY_SKU_ANDROID;
          
          return {
            productId: product.productId,
            price: product.price,
            title: product.title,
            description: product.description,
            currency: product.priceCurrencyCode,
            localizedPrice: product.priceString,
            subscriptionPeriod: product.subscriptionPeriodAndroid || product.subscriptionPeriodNumberIOS,
            type: isMonthly ? 'monthly' : 'yearly'
          };
        });
        
        return this.products;
      } else {
        console.error('製品情報取得エラー:', errorCode);
        throw new Error('製品情報の取得に失敗しました');
      }
    } catch (error) {
      console.error('製品取得エラー:', error);
      throw error;
    }
  }
  
  /**
   * 購入処理
   */
  public async purchaseProduct(productId: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      // 購入リクエスト
      const { responseCode, errorCode } = await InAppPurchases.purchaseItemAsync(productId);
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        return true;
      } else {
        console.error('購入エラー:', errorCode);
        return false;
      }
    } catch (error) {
      console.error('購入処理エラー:', error);
      throw error;
    }
  }
  
  /**
   * 既存購入の復元
   */
  public async restorePurchases(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      // 購入履歴の復元リクエスト
      const { responseCode, results, errorCode } = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        // アクティブなサブスクリプションがあるか確認
        let hasActiveSubscription = false;
        
        for (const purchase of results) {
          const isValidSubscription = await this.validateSubscription(purchase);
          if (isValidSubscription) {
            hasActiveSubscription = true;
          }
        }
        
        return hasActiveSubscription;
      } else {
        console.error('購入履歴復元エラー:', errorCode);
        return false;
      }
    } catch (error) {
      console.error('購入復元エラー:', error);
      throw error;
    }
  }
  
  /**
   * 購入の検証と処理
   */
  private async handlePurchase(purchase: any): Promise<void> {
    try {
      // 購入レシートの検証と確認
      // 注: 実際の本番環境では、サーバーサイドで検証する必要があります
      const isValid = await this.validateSubscription(purchase);
      
      if (isValid) {
        // 購入の完了
        if (!purchase.acknowledged) {
          await InAppPurchases.finishTransactionAsync(purchase, true);
        }
      }
    } catch (error) {
      console.error('購入処理エラー:', error);
    }
  }
  
  /**
   * サブスクリプションの検証
   */
  private async validateSubscription(purchase: any): Promise<boolean> {
    try {
      // ここでは簡易的な検証を行いますが、実際には以下が必要です：
      // 1. レシートをサーバーに送信
      // 2. サーバーからApple/Googleの検証サーバーに検証リクエスト
      // 3. 結果に基づいてデータベースを更新
      
      // 購入情報を整形
      const purchaseInfo: SubscriptionPurchase = {
        productId: purchase.productId,
        transactionId: Platform.OS === 'ios' ? purchase.transactionId : purchase.orderId,
        transactionDate: purchase.transactionDate,
        originalTransactionIdentifierForAndroid: Platform.OS === 'android' ? purchase.originalOrderId : undefined
      };
      
      // サブスクリプションの種類を判定
      const isMonthly = 
        purchaseInfo.productId === PREMIUM_MONTHLY_SKU_IOS || 
        purchaseInfo.productId === PREMIUM_MONTHLY_SKU_ANDROID;
      
      const subscriptionType = isMonthly ? 'monthly' : 'yearly';
      
      // この例では、サブスクリプションの有効期限を簡易的に計算
      // 実際には、サーバー側での検証結果に基づいて設定すべき
      const now = new Date();
      const expirationDate = new Date();
      
      if (isMonthly) {
        expirationDate.setMonth(expirationDate.getMonth() + 1); // 1ヶ月
      } else {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1年
      }
      
      // ユーザーIDの取得
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('認証されていないユーザー');
      }
      
      // Supabaseデータの更新
      // 1. プロフィールをプレミアムに更新
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_until: expirationDate.toISOString()
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // 2. サブスクリプション情報の保存
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          subscription_type: subscriptionType,
          status: 'active',
          start_date: now.toISOString(),
          end_date: expirationDate.toISOString(),
          provider: Platform.OS === 'ios' ? 'apple' : 'google',
          provider_subscription_id: purchaseInfo.transactionId
        });
      
      if (subscriptionError) throw subscriptionError;
      
      // ローカルストレージにも保存
      storage.set('is_premium', true);
      storage.set('premium_until', expirationDate.toISOString());
      
      return true;
    } catch (error) {
      console.error('サブスクリプション検証エラー:', error);
      return false;
    }
  }
  
  /**
   * ユーザーのプレミアムステータスの確認
   */
  public async checkPremiumStatus(userId: string): Promise<boolean> {
    try {
      // Supabaseからユーザープロフィールを取得
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, premium_until')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data.is_premium) {
        // 期限が切れていないか確認
        const premiumUntil = new Date(data.premium_until);
        const now = new Date();
        
        if (premiumUntil > now) {
          // 有効なプレミアムステータス
          return true;
        } else {
          // 期限切れ
          await this.deactivatePremium(userId);
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('プレミアムステータス確認エラー:', error);
      
      // ローカルキャッシュを確認（オフライン時）
      const isPremium = storage.getBoolean('is_premium');
      const premiumUntil = storage.getString('premium_until');
      
      if (isPremium && premiumUntil) {
        const expirationDate = new Date(premiumUntil);
        const now = new Date();
        
        if (expirationDate > now) {
          return true;
        }
      }
      
      return false;
    }
  }
  
  /**
   * プレミアムステータスの無効化
   */
  private async deactivatePremium(userId: string): Promise<void> {
    try {
      // プロフィールのプレミアムステータスを更新
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_premium: false,
          premium_until: null
        })
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      // サブスクリプションの状態を更新
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({
          status: 'expired'
        })
        .eq('user_id', userId)
        .eq('status', 'active');
      
      if (subscriptionError) throw subscriptionError;
      
      // ローカルストレージの更新
      storage.delete('is_premium');
      storage.delete('premium_until');
    } catch (error) {
      console.error('プレミアム無効化エラー:', error);
    }
  }
}