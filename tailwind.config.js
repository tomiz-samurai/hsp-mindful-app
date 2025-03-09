/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#8ABFD6',
          DEFAULT: '#62A5BF',
          dark: '#4A7E95',
        },
        secondary: {
          light: '#B8A393',
          DEFAULT: '#9B7E6B',
          dark: '#7C6456',
        },
        accent: {
          light: '#F7BC85',
          DEFAULT: '#F4A261',
          dark: '#D48142',
        },
        background: {
          primary: '#F8F3E6',
          secondary: '#FFFFFF',
          tertiary: '#F2EDE4',
        },
        text: {
          primary: '#2C3E50',
          secondary: '#5D6D7E',
          tertiary: '#8395A7',
          inverted: '#FFFFFF',
        },
      },
      fontFamily: {
        primary: ['NotoSansJP-Regular', 'sans-serif'],
        secondary: ['NotoSansJP-Medium', 'sans-serif'],
      },
    },
  },
  plugins: [],
};