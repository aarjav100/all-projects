/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a78bfa',
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
        },
        accent: {
          light: '#22d3ee',
          DEFAULT: '#06b6d4',
          dark: '#0891b2',
        },
        slate: {
          850: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #030712 100%)',
      }
    },
  },

  plugins: [],
}
