/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050608',
        surface: '#0D1117', // Card Background
        card: '#0D1117', // Card Background
        'secondary-card': '#111827', // Secondary Card
        primary: '#39FF14', // Neon Green
        secondary: '#1DB954', // Medium Green
        success: '#39FF14',
        warning: '#FACC15',
        danger: '#EF4444',
        text: '#FFFFFF', // Primary Text
        'text-secondary': '#B7BDC8', // Secondary Text
        muted: '#9CA3AF', // Muted Text
        border: 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px', // 20px rounded corners specified
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(57, 255, 20, 0.15)',
        'glow-strong': '0 0 30px rgba(57, 255, 20, 0.3)',
        'glow-secondary': '0 0 20px rgba(29, 185, 84, 0.2)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        card: '0 4px 20px rgba(0, 0, 0, 0.4)',
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
