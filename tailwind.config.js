module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // ✅ Next.js 13+ 구조
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  purge: [],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        // 커스텀 컬러 지정
        'main-background': '#fafaf8',
        'main-text': '#333333',
        'main-yellow': '#FFD939',
        'bg-yellow': '#FFFDEC',
        'content-yellow': '#FFF399',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
