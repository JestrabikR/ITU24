/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'to-xs': [{'min': '480px', 'max': '640px'}],
      },
      boxShadow: {
        'card-shadow': '0 0px 12px 3px rgba(0, 0, 0, 0.15)',
        'card-shadow-hover': '0 0px 15px 4px rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif']
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}