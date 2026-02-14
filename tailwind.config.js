/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#2563eb', 600: '#1d4ed8', 700: '#1e40af' },
        accent: { 500: '#10b981', 600: '#059669', 700: '#047857' },
      },
    },
  },
  plugins: [],
};
