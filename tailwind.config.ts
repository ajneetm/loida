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
        heading: ['Raleway', 'sans-serif'],
        body:    ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        arabic:  ['Tajawal', 'sans-serif'],
        // legacy aliases used by dashboard
        display: ['Raleway', 'sans-serif'],
        mono:    ['monospace'],
      },
      colors: {
        // Brand (loidabritish.com exact values)
        brand: {
          navy:  '#022269',
          royal: '#1a73e8',
          red:   '#c71430',
          cyan:  '#607980',
        },
        // Backward compat aliases used in dashboard
        navy:    { DEFAULT: '#022269', light: '#1a3a8f', dark: '#011344' },
        harmony: { DEFAULT: '#607980', light: '#8AACBA', dark: '#4A7286' },
        career:  { DEFAULT: '#022269', light: '#1a3a8f', dark: '#011344' },
        business:{ DEFAULT: '#c71430', light: '#e03050', dark: '#8e0e22' },
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
        'fade-up': 'fade-up 0.6s ease forwards',
        'fade-in': 'fade-in 0.4s ease forwards',
        'shimmer': 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
