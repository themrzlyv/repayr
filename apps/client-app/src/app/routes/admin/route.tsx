import { createAuthGuard } from "@/app/lib/create-auth-guard";
import { AccountLayout } from "@/app/modules/root-app/interface/ui/account-layout/account-layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: createAuthGuard({
    redirectTo: "/dashboard",
    allowUnauthenticated: false,
  }),
});

function RouteComponent() {
  return (
    <AccountLayout>
      <Outlet />
    </AccountLayout>
  );
}
