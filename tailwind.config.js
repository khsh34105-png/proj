/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        rose: { glow: '#ff6b9d' },
        violet: { glow: '#c77dff' },
        sky: { glow: '#72efdd' },
        amber: { glow: '#ffd60a' },
      }
    },
  },
  plugins: [],
}
