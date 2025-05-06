export const API_URL = import.meta.env.VITE_APP_API_URL as string;

export const SESSION_COOKIE_NAME = "repayr.sid";

export const skip401endpoints = ["verifySession"];

export const authRoutes = ["/sign-in", "/sign-up"];
