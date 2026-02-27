/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        skewAuto: {
          '0%, 100%': { transform: 'skewX(0deg)' },
          '50%': { transform: 'skewX(-12deg)' },
        },
      },
      animation: {
        skewAuto: 'skewAuto 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
