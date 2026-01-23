/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        PoiretOneRegular: ["PoiretOneRegular"],
        SpaceGroteskBold: ["SpaceGroteskBold"],
        SpaceGroteskLight: ["SpaceGroteskLight"],
        SpaceGroteskMedium: ["SpaceGroteskMedium"],
        SpaceGroteskRegular: ["SpaceGroteskRegular"],
        SpaceGroteskSemiBold: ["SpaceGroteskSemiBold"],
        VictorMonoBold: ["VictorMonoBold"],
        VictorMonoRegular: ["VictorMonoRegular"],
        VictorMonoLight: ["VictorMonoLight"],
        VictorMonoMedium: ["VictorMonoMedium"],
      },
      colors: {
        clearColor: "#F8F2F2",
        mainColor: "#8E2C36",
        darkColor: "#1B110E",
      },
    },
  },
  plugins: [],
};
