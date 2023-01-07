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
            100: '#cfdfee',
            200: '#9ebfdc',
            300: '#6e9fcb',
            400: '#3d7fb9',
            500: '#0d5fa8',
            550: '#0c5697',
            600: '#0a4c86',
            700: '#083965',
            800: '#052643',
            900: '#031322',
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
