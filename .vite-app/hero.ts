import { heroui } from "@heroui/react";

export default heroui({
  layout: {
    borderWidth: {
      small: "1px",
      medium: "1px",
      large: "2px",
    },
  },
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: "#1DCD9F",
          foreground: "#ffffff",
          "700": "#169976",
        },
      },
    },
  },
}) as any;
