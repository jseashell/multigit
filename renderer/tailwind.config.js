const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./renderer/pages/**/*.{js,ts,jsx,tsx}', './renderer/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // colors: {
    //   // use colors only specified
    //   red: colors.red,
    //   orange: colors.orange,
    //   yellow: colors.yellow,
    //   green: colors.green,
    //   blue: colors.blue,
    //   purple: colors.purple,
    //   white: colors.white,
    //   gray: colors.gray,
    //   black: colors.black,
    // },
    extend: {},
  },
  plugins: [],
};
