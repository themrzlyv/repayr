import { Outlet } from "react-router";

import { Route } from "./+types/layout";

import { SESSION_COOKIE_NAME } from "~/lib/constants";
import { unAuthorizedHeader } from "~/lib/utils";
import { AccountLayout } from "~/modules/root-app/interface/ui/account-layout/account-layout";

export function meta() {
  return [
    { title: "Account Layout" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("cookie") ?? "";
  const isValidSession = cookie.includes(SESSION_COOKIE_NAME);
  if (!isValidSession) {
    return new Response(null, {
      status: 302,
      headers: unAuthorizedHeader(),
    });
  }
  return null;
}

export default function Layout() {
  return (
    <AccountLayout>
      <Outlet />
    </AccountLayout>
  );
}
