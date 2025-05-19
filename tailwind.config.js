module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-background': '#fafaf8',
        'main-text': '#333333',
        'main-yellow': '#FFD939',
        'bg-yellow': '#FFFDEC',
        'content-yellow': '#FFF399',
      },
      screens: {
        iphoneSE: { max: '375px' },
      },
    },
  },
  plugins: [],
};
