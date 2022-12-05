/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: ['class', '[class="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        custom: {
          light: {
            100: '#cedbe7',
            200: '#9db7ce',
            300: '#6c93b6',
            400: '#3b6f9d',
            500: '#0a4b85',
            550: '#094478',
            600: '#083c6a',
            700: '#062d50',
            800: '#041e35',
            900: '#020f1b',
          },
          dark: {
            100: '#f5cccc',
            200: '#eb9999',
            300: '#e06666',
            400: '#d63333',
            500: '#cc0000',
            550: '#b80000',
            600: '#a30000',
            700: '#7a0000',
            800: '#520000',
            900: '#290000',
          },
        },
      },
      borderRadius: {
        DEFAULT: '1rem',
        DEFAULT: '16px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
