const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        sansation: ["Sansation", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to bottom right, #faf4f6, #eef0d5, #bcc1ad)",
      },
      colors: {
        background: {
          100: "#ffffff",
          200: "#fcfcfa",
          300: "#f9f9f6",
          400: "#f8f8f4",
          500: "#f7f7f2",
          600: "#d8d8d0",
          700: "#b2b2ab",
          800: "#8c8c86",
          900: "#666662",
          foreground: "#1f1f1d",
          DEFAULT: "#f7f7f2",
        },
        primary: {
          100: "#f0f1ed",
          200: "#d6d9cd",
          300: "#bcc1ad",
          400: "#a2a98e",
          500: "#899878",
          600: "#6d7960",
          700: "#525b48",
          800: "#373c30",
          900: "#1c1e18",
          foreground: "#f9f9f5",
          DEFAULT: "#899878",
        },
        secondary: {
          100: "#f9faef",
          200: "#f0f2da",
          300: "#e8ebc6",
          400: "#dfe4b1",
          500: "#e4e6c3",
          600: "#c2c4a8",
          700: "#9e9f87",
          800: "#7a7b66",
          900: "#565845",
          foreground: "#2a2c1f",
          DEFAULT: "#e4e6c3",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: {
              100: "#ffffff",
              200: "#fcfcfa",
              300: "#f9f9f6",
              400: "#f8f8f4",
              500: "#f7f7f2",
              600: "#d8d8d0",
              700: "#b2b2ab",
              800: "#8c8c86",
              900: "#666662",
              foreground: "#1f1f1d",
              DEFAULT: "#f7f7f2",
            },
            primary: {
              100: "#f0f1ed",
              200: "#d6d9cd",
              300: "#bcc1ad",
              400: "#a2a98e",
              500: "#899878",
              600: "#6d7960",
              700: "#525b48",
              800: "#373c30",
              900: "#1c1e18",
              foreground: "#f9f9f5",
              DEFAULT: "#899878",
            },
            secondary: {
              100: "#f9faef",
              200: "#f0f2da",
              300: "#e8ebc6",
              400: "#dfe4b1",
              500: "#e4e6c3",
              600: "#c2c4a8",
              700: "#9e9f87",
              800: "#7a7b66",
              900: "#565845",
              foreground: "#2a2c1f",
              DEFAULT: "#e4e6c3",
            },
          },
        },
      },
    }),
  ],
};
