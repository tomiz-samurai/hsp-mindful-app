import { MMKV as MMKVStorage } from 'react-native-mmkv';

/**
 * HSPアプリのローカルストレージ
 * 高速で効率的なデータ永続化のためのMMKVラッパー
 */

export const MMKV = new MMKVStorage();

// 型安全なユーティリティラッパー
export const storage = {
  // 文字列の取得
  getString: (key: string): string | undefined => {
    return MMKV.getString(key);
  },
  
  // 数値の取得
  getNumber: (key: string): number | undefined => {
    return MMKV.getNumber(key);
  },
  
  // 真偽値の取得
  getBoolean: (key: string): boolean | undefined => {
    return MMKV.getBoolean(key);
  },
  
  // オブジェクトの取得
  getObject: <T>(key: string): T | undefined => {
    const json = MMKV.getString(key);
    if (!json) return undefined;
    try {
      return JSON.parse(json) as T;
    } catch (e) {
      console.error(`Failed to parse stored object for key: ${key}`, e);
      return undefined;
    }
  },
  
  // 値の設定
  set: (key: string, value: string | number | boolean | object): void => {
    if (typeof value === 'string') {
      MMKV.set(key, value);
    } else if (typeof value === 'number') {
      MMKV.set(key, value);
    } else if (typeof value === 'boolean') {
      MMKV.set(key, value);
    } else {
      MMKV.set(key, JSON.stringify(value));
    }
  },
  
  // キーの削除
  delete: (key: string): void => {
    MMKV.delete(key);
  },
  
  // すべてのキーを削除
  clearAll: (): void => {
    MMKV.clearAll();
  },
  
  // すべてのキーを取得
  getAllKeys: (): string[] => {
    return MMKV.getAllKeys();
  },
};
