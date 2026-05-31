/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f9f7',
          100: '#c2f0eb',
          200: '#9de6df',
          300: '#78ddd3',
          400: '#4ecdc4',
          500: '#41b3ab',
          600: '#349992',
          700: '#287f79',
          800: '#1b6560',
          900: '#0f4b47',
        },
        secondary: {
          50: '#eef3f8',
          100: '#d5e3ed',
          200: '#bcd3e2',
          300: '#a3c3d7',
          400: '#95b8d1',
          500: '#7a9fc0',
          600: '#5f86af',
          700: '#4d6d8d',
          800: '#3b546b',
          900: '#293b49',
        },
        accent: {
          50: '#eceef5',
          100: '#d0d4e7',
          200: '#b4bad9',
          300: '#98a0cb',
          400: '#556fb5',
          500: '#4a609f',
          600: '#3e5189',
          700: '#334273',
          800: '#27335d',
          900: '#1c2447',
        },
        neutral: {
          50: '#f3f4f7',
          100: '#e4e6eb',
          200: '#d5d7df',
          300: '#c6c9d3',
          400: '#9fa4c4',
          500: '#8890b3',
          600: '#717ca2',
          700: '#5a6891',
          800: '#435480',
          900: '#2c406f',
        },
        teal: {
          50: '#e6f2f1',
          100: '#c0dbd8',
          200: '#9ac4bf',
          300: '#74ada6',
          400: '#41837e',
          500: '#386f6b',
          600: '#2f5b58',
          700: '#264745',
          800: '#1d3332',
          900: '#141f1f',
        }
      },
      backgroundImage: {
        'financial-gradient': 'linear-gradient(135deg, #556fb5 0%, #4ecdc4 50%, #95b8d1 100%)',
        'growth-pattern': 'radial-gradient(circle at 50% 50%, rgba(78, 205, 196, 0.1) 0%, transparent 50%)',
        'hero-gradient': 'linear-gradient(135deg, #41837e 0%, #556fb5 25%, #4ecdc4 75%, #95b8d1 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(85, 111, 181, 0.1) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(78, 205, 196, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(78, 205, 196, 0.4)' },
        },
      }
    },
  },
  plugins: [],
};