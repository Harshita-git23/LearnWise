/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f4f4f5',
          100: '#e9e9ec',
          200: '#d1d1d8',
          300: '#a9a9b8',
          400: '#7a7a90',
          500: '#5c5c74',
          600: '#4a4a60',
          700: '#3a3a4f',
          800: '#252535',
          900: '#16161f',
          950: '#0d0d14',
        },
        accent: {
          DEFAULT: '#6b8cff',
          hover: '#5a7aee',
          soft: 'rgba(107,140,255,0.12)',
        },
        teal: {
          mind: '#3ecfcf',
        }
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
        'modal': '0 20px 60px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.25rem',
      }
    },
  },
  plugins: [],
}
