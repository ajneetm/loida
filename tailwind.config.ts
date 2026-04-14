import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      colors: {
        // Brand
        navy:    { DEFAULT: '#0F1B35', light: '#1A2B4A', dark: '#080E1C' },
        gold:    { DEFAULT: '#B8973A', light: '#D4B05A', dark: '#8A6E25' },
        // Domain colors
        harmony: { DEFAULT: '#6B8F9E', light: '#8AACBA', dark: '#4A7286' },
        career:  { DEFAULT: '#B8973A', light: '#D4B05A', dark: '#8A6E25' },
        business:{ DEFAULT: '#2C4A3E', light: '#3D6455', dark: '#1A2E26' },
        // Neutrals
        stone: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.6s ease forwards',
        'fade-in':    'fade-in 0.4s ease forwards',
        'shimmer':    'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
