module.exports = {
  content: [
    "./index.html",
    "./volume.html",
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
        sandstone: {
          DEFAULT: '#E8D5B7',
          light: '#F2E6D0',
          dark: '#D4BC94',
          deep: '#C4A882',
        },
        jade: {
          DEFAULT: '#3B8B5E',
          light: '#5CAD7E',
          dark: '#2A6B46',
        },
        obsidian: '#2C2416',
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
        shake: 'shake 0.5s ease-in-out',
        confetti: 'confetti 1s ease-out forwards',
        zonePulse: 'zonePulse 2s ease-in-out infinite',
        zoneTargetPulse: 'zoneTargetPulse 1.2s ease-in-out infinite',
        stickerBounce: 'stickerBounce 0.6s ease-out 1s both',
        jadeGlow: 'jadeGlow 2s ease-in-out infinite',
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
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 50%, 90%': { transform: 'translateX(-4px)' },
          '30%, 70%': { transform: 'translateX(4px)' },
        },
        confetti: {
          '0%': { opacity: '1', transform: 'translateY(0) translateX(0)' },
          '100%': { opacity: '0', transform: 'translateY(-200px) translateX(var(--drift, 0px))' },
        },
        zonePulse: {
          '0%, 100%': { boxShadow: 'inset 0 0 4px rgba(45, 106, 79, 0.15)' },
          '50%': { boxShadow: 'inset 0 0 12px rgba(45, 106, 79, 0.3)' },
        },
        zoneTargetPulse: {
          '0%, 100%': { boxShadow: '0 0 6px rgba(45, 106, 79, 0.3)', borderColor: 'rgba(45, 106, 79, 0.4)' },
          '50%': { boxShadow: '0 0 16px rgba(45, 106, 79, 0.6)', borderColor: 'rgba(45, 106, 79, 0.7)' },
        },
        stickerBounce: {
          '0%': { opacity: '0', transform: 'scale(0) rotate(-12deg)' },
          '60%': { opacity: '1', transform: 'scale(1.15) rotate(-12deg)' },
          '80%': { transform: 'scale(0.95) rotate(-12deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-12deg)' },
        },
        jadeGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(59, 139, 94, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 139, 94, 0.6), 0 0 40px rgba(59, 139, 94, 0.2)' },
        },
      },
    },
  },
  plugins: [],
}
