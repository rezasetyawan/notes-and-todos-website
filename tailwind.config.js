/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "accent-color1": "#f1f3f4",
      },
      fontFamily: {
        "open-sans": ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
