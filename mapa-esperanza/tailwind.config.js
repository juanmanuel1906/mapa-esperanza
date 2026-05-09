/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-datepicker/**/*.js"
  ],
    theme: {
    screens: {
      xs: "320px",
      mobile: "480px",
      tablet: "769px",
      laptop: "1024px",
      desktop: "1280px",
    },
    extend: {}
  },
  plugins: [require("flowbite/plugin")],
};