/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#ebff4d',
        accent: '#6366f1',
        'accent-dark': '#4f46e5',
        primary: '#0f172a',
      },
    },
  },
  plugins: [],
}
