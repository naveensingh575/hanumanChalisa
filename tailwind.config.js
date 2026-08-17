/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        vermilion: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        sacred: {
          gold: '#FFD700',
          amber: '#F59E0B',
          saffron: '#FF6F00',
          darkSaffron: '#D97706',
          vermilion: '#E63946',
          sandal: '#FEF3C7',
          cream: '#FFFDF9',
          charcoal: '#1E1B18',
          night: '#0D1117',
          deepNight: '#07090E',
          templeRed: '#8B0000',
          tilak: '#C41E3A'
        }
      },
      fontFamily: {
        devanagari: ['"Noto Serif Devanagari"', '"Tiro Devanagari Hindi"', 'serif'],
        devanagariHeading: ['"Rozha One"', '"Yatra One"', '"Noto Serif Devanagari"', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
      },
      boxShadow: {
        'divine': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'divine-lg': '0 0 50px -10px rgba(217, 119, 6, 0.45)',
        'flame': '0 0 15px rgba(245, 158, 11, 0.7), 0 0 30px rgba(225, 29, 72, 0.4)',
      },
      animation: {
        'flame-flicker': 'flame 3s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-gentle': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.95' },
          '50%': { transform: 'scale(1.08) rotate(1.5deg)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
