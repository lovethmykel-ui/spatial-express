/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background-rgb, 248 250 252) / <alpha-value>)',
        surface: 'rgb(var(--color-surface-rgb, 255 255 255) / <alpha-value>)',
        card: 'rgb(var(--color-card-rgb, 255 255 255) / <alpha-value>)',
        'secondary-card': 'rgb(var(--color-secondary-card-rgb, 241 245 249) / <alpha-value>)',
        primary: 'rgb(var(--color-primary-rgb, 22 163 74) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary-rgb, 13 148 136) / <alpha-value>)',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: 'rgb(var(--color-text-rgb, 15 23 42) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary-rgb, 71 85 105) / <alpha-value>)',
        muted: 'rgb(var(--color-muted-rgb, 100 116 139) / <alpha-value>)',
        border: 'var(--color-border, rgba(0, 0, 0, 0.08))',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(22, 163, 74, 0.15)',
        'glow-strong': '0 0 30px rgba(22, 163, 74, 0.25)',
        'glow-secondary': '0 0 20px rgba(13, 148, 136, 0.15)',
        glass: '0 8px 30px 0 rgba(0, 0, 0, 0.06)',
        card: '0 2px 12px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'truck-roll': 'truckRoll 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        truckRoll: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
