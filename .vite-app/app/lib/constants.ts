import { ROUTES } from "~/routes";

export const API_URL = import.meta.env.VITE_APP_API_URL as string;

export const SESSION_COOKIE_NAME = "repayr.sid";

export const skip401endpoints = ["verifySession"];

export const authRoutes = ["/sign-in", "/sign-up"];

export const menuItems = [
  {
    path: ROUTES.features,
    label: "Features",
  },
  {
    path: ROUTES.about,
    label: "About",
  },
  {
    path: ROUTES.contact,
    label: "Contact",
  },
];
