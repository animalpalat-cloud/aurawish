/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
        script: ['"Great Vibes"', '"Dancing Script"', 'cursive'],
        outfit: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        gold: {
          50: '#fbf8ea',
          100: '#f5eecc',
          200: '#ebd998',
          300: '#dfbf5e',
          400: '#d4a833',
          500: '#b88b22',
          600: '#946a1a',
          700: '#704c18',
          800: '#543717',
          900: '#402914',
          foil: '#E5C07B',
          glow: '#FFD700',
        },
        obsidian: {
          950: '#06070B',
          900: '#0C0E14',
          850: '#11141E',
          800: '#171B26',
          700: '#23293A',
          600: '#323B52',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'tilt': 'tilt 10s infinite linear',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(217, 70, 239, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(217, 70, 239, 0.6), 0 0 15px rgba(245, 208, 254, 0.4)' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        }
      },
      boxShadow: {
        'glow-brand': '0 0 40px -10px rgba(217, 70, 239, 0.45)',
        'glow-gold': '0 0 40px -10px rgba(229, 192, 123, 0.45)',
        'glow-cyan': '0 0 40px -10px rgba(6, 182, 212, 0.45)',
        'card-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'card-light': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
