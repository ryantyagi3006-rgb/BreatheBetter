/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#042C53',
          50: '#EBF2FA',
          100: '#B5D4F4',
          200: '#7BAEE8',
          300: '#4A8AD6',
          400: '#2A6DC0',
          500: '#185FA5',
          600: '#124D89',
          700: '#0C3C6D',
          800: '#072D52',
          900: '#042C53',
          950: '#021E3A',
        },
        lightblue: '#B5D4F4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
        'breathe-fast': 'breathe 1.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease both',
        'fade-up': 'fadeUp 0.5s ease both',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        breathe: {
          '0%,100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%':     { transform: 'scale(1.25)', opacity: '1' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(24,95,165,0.4)' },
          '50%':     { boxShadow: '0 0 0 20px rgba(24,95,165,0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
