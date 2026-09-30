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
        // Deep Dark Surfaces
        surface: {
          base: '#050505',
          card: '#0D1117',
          elevated: '#11161D',
          border: '#1B222D',
          borderLight: '#26303E',
          muted: '#161B22',
        },
        // Brand Greens
        bgreen: {
          deep: '#19B000',
          DEFAULT: '#4CAF00',
          lime: '#9ACD00',
          50: '#f0fdf0',
          100: '#dcfce0',
          200: '#bbf7bd',
          300: '#9ACD00',
          400: '#4CAF00',
          500: '#19B000',
          600: '#148C00',
          700: '#0F6B00',
          800: '#0B4F00',
          900: '#0D1117',
          950: '#050505',
        },
        // Mustard & Golden Yellows
        gold: {
          DEFAULT: '#FFC61A',
          bright: '#FFD43B',
          light: '#FFE066',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#FFE066',
          400: '#FFD43B',
          500: '#FFC61A',
          600: '#D9A100',
          700: '#B38400',
          800: '#8C6700',
          900: '#0D1117',
          950: '#050505',
        },
        // Brand mapping
        brand: {
          50: '#f0fdf0',
          100: '#dcfce0',
          200: '#bbf7bd',
          300: '#9ACD00',
          400: '#4CAF00',
          500: '#19B000',
          600: '#148C00',
          700: '#0F6B00',
          800: '#0B4F00',
          900: '#083800',
          950: '#050505',
        },
        // STRICT OVERRIDE: Zero Blue, Zero Cyan, Zero Purple, Zero Pink
        // Re-mapping legacy Tailwind color names to Brand Greens & Golden Yellows & Surfaces
        indigo: {
          50: '#f0fdf0',
          100: '#dcfce0',
          200: '#bbf7bd',
          300: '#9ACD00', // Lime
          400: '#4CAF00', // Mid green
          500: '#19B000', // Deep brand green
          600: '#148C00',
          700: '#0F6B00',
          800: '#161B22',
          900: '#0D1117',
          950: '#050505',
        },
        purple: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#FFE066',
          400: '#FFD43B',
          500: '#FFC61A', // Mustard golden
          600: '#D9A100',
          700: '#B38400',
          800: '#161B22',
          900: '#0D1117',
          950: '#050505',
        },
        blue: {
          50: '#f0fdf0',
          100: '#dcfce0',
          200: '#bbf7bd',
          300: '#9ACD00',
          400: '#4CAF00',
          500: '#19B000',
          600: '#148C00',
          700: '#0F6B00',
          800: '#161B22',
          900: '#0D1117',
          950: '#050505',
        },
        cyan: {
          50: '#f0fdf0',
          100: '#dcfce0',
          200: '#bbf7bd',
          300: '#9ACD00',
          400: '#4CAF00',
          500: '#19B000',
          600: '#148C00',
          700: '#0F6B00',
          800: '#161B22',
          900: '#0D1117',
          950: '#050505',
        },
        pink: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#FFE066',
          400: '#FFD43B',
          500: '#FFC61A',
          600: '#D9A100',
          700: '#B38400',
          800: '#161B22',
          900: '#0D1117',
          950: '#050505',
        },
        lot: {
          dark: '#050505',
          card: '#0D1117',
          cardBorder: '#1B222D',
          accent: '#19B000',
          teal: '#4CAF00',
          coral: '#FFC61A',
          gold: '#FFC61A',
          purple: '#9ACD00'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-green': 'glowGreen 2s ease-in-out infinite alternate',
        'glow-gold': 'glowGold 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowGreen: {
          '0%': { boxShadow: '0 0 10px rgba(25, 176, 0, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(25, 176, 0, 0.7)' },
        },
        glowGold: {
          '0%': { boxShadow: '0 0 10px rgba(255, 198, 26, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 198, 26, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
