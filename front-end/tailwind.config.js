module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        synthwave: {
          ...require("daisyui/src/colors/themes")["[data-theme=synthwave]"],
          "base-content": "#4641C5ff", // palatinate-blue
          "base-200": "#4641C5ff", // palatinate-blue
          "base-300": "#309EEBff", //--celestial-blue"
          accent: "#C02826ff",
          "--palatinate-blue": "#4641C5ff",
          "--byzantium": "#702762ff",
          "--fire-engine-red": "#C02826ff",
          "--wine": "#753140ff",
          "--celestial-blue": "#309EEBff",
        },
      },
    ],
  },
};
