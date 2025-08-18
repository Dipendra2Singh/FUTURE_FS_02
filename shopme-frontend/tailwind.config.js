/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pizza-orange': '#ff6b35',
        'pizza-dark': '#2c2c2c',
        'pizza-light': '#f8f8f8',
      },
    },
  },
  plugins: [],
}