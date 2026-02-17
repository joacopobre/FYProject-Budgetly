/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide"
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
      },
    },
  },
  plugins: [
    scrollbarHide,
  ],
}
