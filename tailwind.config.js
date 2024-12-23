/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightGrayTransparent: 'rgba(17, 15, 15, 0.1)', // Custom color
      },
    },
  },
  plugins: [],
};
