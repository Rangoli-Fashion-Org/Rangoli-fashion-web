/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: '#003D2D',
          darkEmerald: '#002D21',
          secondaryGreen: '#0B5940',
          gold: '#C9A34A',
          goldLight: '#DFC37A',
          ivory: '#FFF8ED',
          cream: '#F5EBDD',
          textDark: '#191714',
          textMuted: '#746D62',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

