/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B0F19',
          card: '#131B2E',
          border: '#1E293B',
          cyan: '#00F0FF',
          purple: '#8A2BE2',
          pink: '#FF007F',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'scan-line': 'scanLine 3s ease-in-out infinite alternate',
        'radar-spin': 'radarSpin 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 240, 255, 0.6)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        radarSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
