# HSP Mindful App

HSP（高感受性者）向けのマインドフルネスアプリケーション。

## 主要機能

1. **フクロウAIカウンセラー** - 親しみやすいフクロウキャラクターをインターフェースとしたAIチャットボット
2. **マインドフルネス＆リラクゼーションパック** - ガイド付き瞑想、呼吸法、サウンドセラピー

## 技術スタック

- **フロントエンド**: React Native, Expo, TypeScript
- **状態管理**: Zustand
- **スタイリング**: NativeWind, React Native Paper
- **バックエンド**: Supabase (Auth, Database, Storage)
- **AI機能**: Claude API

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/tomiz-samurai/hsp-mindful-app.git
cd hsp-mindful-app

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm start
```

## プロジェクト構造

```
my-expo-app/
├── app/                            # Expoルーター (ファイルベースルーティング)
├── components/                     # UIコンポーネント
├── hooks/                         # カスタムフック
├── lib/                           # 外部サービス/ユーティリティ
├── store/                         # 状態管理
├── services/                      # サービス層
├── types/                         # 型定義
├── config/                        # アプリ設定
├── assets/                        # 静的アセット
├── styles/                        # スタイル定義
```

## ライセンス

MIT
