/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F9F5F1',
        secondary: '#E8D5C4',
        accent: '#7D6E83',
        text: '#4A4A4A',
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};