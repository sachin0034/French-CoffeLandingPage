/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      letterSpacing: {
        'extra-wide': '0.2em',  // Add a custom letter spacing value
      },
    },
  },
  plugins: [],
}