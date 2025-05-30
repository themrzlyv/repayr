export const API_URL = import.meta.env.VITE_APP_API_URL as string;

export const skip401endpoints = ["verifySession"];

export const authRoutes = ["/sign-in", "/sign-up"];

export const menuItems = [
  {
    path: "/features",
    label: "Features",
  },
  {
    path: "/about",
    label: "About",
  },
  {
    path: "/contact",
    label: "Contact",
  },
];
