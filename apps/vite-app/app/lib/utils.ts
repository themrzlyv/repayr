import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { SESSION_COOKIE_NAME } from "./constants";

import { ROUTES } from "~/routes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function unAuthorizedHeader() {
  return {
    Location: ROUTES.signIn,
    "Set-Cookie": `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`,
  };
}
