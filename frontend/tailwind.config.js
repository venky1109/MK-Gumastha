/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: { animation: {
        blink: 'blink 3s step-end infinite',
      }, keyframes: {
        blink: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: '#fecaca' } // red-200
        },
      },},
  },
  plugins: [],
}

