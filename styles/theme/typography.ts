/**
 * HSP向けアプリのタイポグラフィ設定
 * 読みやすさと視覚的な静けさを重視
 */
export const typography = {
  // フォントファミリー
  fontFamily: {
    primary: "'Noto Sans JP', sans-serif",
    secondary: "'Hiragino Sans', sans-serif",
  },
  
  // フォントサイズ（ピクセル単位）
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 22,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  // フォントウェイト
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
  
  // 行の高さ
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  
  // 文字間隔
  letterSpacing: {
    tight: '-0.01em',
    normal: '0em',
    wide: '0.02em',
  },
  
  // テキストスタイル（事前定義されたスタイルセット）
  style: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: 22,
      fontWeight: '700',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    small: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.3,
      letterSpacing: '0.01em',
    },
    button: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    nav: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 1.2,
      letterSpacing: '0.01em',
    },
  },
};