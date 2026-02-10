module.exports = {
  content: [
    "./index.html",
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#FAF3E0',
          dark: '#F5E6C8',
          light: '#FDF8F0',
        },
        jungle: '#2D6A4F',
        amber: '#D4A017',
        clay: '#C08552',
        imperial: '#6A0DAD',
        vermilion: '#CC3333',
        mediterranean: '#1E5B94',
        inca: '#8B5E3C',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        crimson: ['Crimson Text', 'serif'],
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        stepReveal: 'stepReveal 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stepReveal: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
