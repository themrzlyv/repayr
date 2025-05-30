import { SESSION_COOKIE_NAME } from "./constants";

import { ROUTES } from "~/routes";

export function unAuthorizedHeader() {
  return {
    Location: ROUTES.signIn,
    "Set-Cookie": `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`,
  };
}
