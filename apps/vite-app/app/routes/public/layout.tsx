import { Outlet } from "react-router";

import { PublicLayout } from "~/modules/root-app/interface/ui/public-layout/public-layout";

export function meta() {
  return [
    { title: "Public Layout" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Layout() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}
