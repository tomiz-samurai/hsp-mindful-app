/**
 * HSP向けアプリのカラーパレット
 * 視覚的な静寂さと落ち着きを意識した色調設計
 */
export const colors = {
  // メインカラー
  primary: {
    light: '#8ABFD6', // 薄い青
    DEFAULT: '#62A5BF', // 穏やかな青
    dark: '#4A7E95', // 暗めの青
  },
  
  // サブカラー
  secondary: {
    light: '#B8A393', // 薄い茶色
    DEFAULT: '#9B7E6B', // アースカラー
    dark: '#7C6456', // 暗めの茶色
  },
  
  // アクセントカラー
  accent: {
    light: '#F7BC85', // 薄いオレンジ
    DEFAULT: '#F4A261', // ソフトオレンジ
    dark: '#D48142', // 暗めのオレンジ
  },
  
  // バックグラウンドカラー
  background: {
    primary: '#F8F3E6', // オフホワイト（メイン背景）
    secondary: '#FFFFFF', // 白（カード背景など）
    tertiary: '#F2EDE4', // 薄いベージュ（アクセント背景）
  },
  
  // テキストカラー
  text: {
    primary: '#2C3E50', // ダークブルー（メインテキスト）
    secondary: '#5D6D7E', // グレイブルー（サブテキスト）
    tertiary: '#8395A7', // ライトグレイ（微小テキスト）
    inverted: '#FFFFFF', // 白（反転テキスト）
  },
  
  // ステータスカラー
  status: {
    success: '#7FB69F', // 優しいグリーン
    warning: '#E9C46A', // 柔らかい黄色
    error: '#E76F51', // 柔らかい赤
    info: '#77ACF1', // 明るい青
  },
  
  // グレースケール
  gray: {
    100: '#F7F9FA',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
  
  // ダークモード設定
  darkMode: {
    colors: {
      background: {
        primary: '#2A2A2C', // ダークグレー
        secondary: '#3A3A3C', // ミディアムグレー
        tertiary: '#252527', // 濃いめのダークグレー
      },
      text: {
        primary: '#F2F2F7', // 明るい白
        secondary: '#AEAEB2', // 明るいグレー
        tertiary: '#8E8E93', // ミディアムグレー
        inverted: '#1C1C1E', // ほぼ黒
      },
    },
  },
};