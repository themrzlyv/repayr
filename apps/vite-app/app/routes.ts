import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export const ROUTES = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/account/dashboard",
  debts: "/account/debts",
  about: "/about",
  home: "/",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export default [
  layout("routes/public/layout.tsx", [
    index("routes/public/home.tsx"),
    route("/about", "routes/public/about.tsx"),
    route("/sign-in", "routes/public/sign-in.tsx"),
    route("/sign-up", "routes/public/sign-up.tsx"),
  ]),

  layout("routes/account/layout.tsx", [
    route("/account/dashboard", "routes/account/dashboard.tsx"),
    route("/account/debts", "routes/account/debts.tsx"),
  ]),
] satisfies RouteConfig;
