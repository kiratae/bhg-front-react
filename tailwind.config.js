/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // "./node_modules/flowbite-react/**/*.js",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-thai-looped': ['"Noto Sans Thai Looped"', 'sans-serif'],
      },
    },
  },
  plugins: [
    // require('flowbite/plugin')
    flowbite.plugin(),
  ],
}