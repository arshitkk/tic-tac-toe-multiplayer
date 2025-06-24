/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkNavy: "#171D22",
        mintGreen: "#488471",
        softOlive: "#859659",
        deepOlive: "#536949",
        forestGreen: "#15302F",
        paleYellow: "#FFF2B7",
      },
    },
  },
  plugins: [],
};
