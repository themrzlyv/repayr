import { createAuthGuard } from "@/app/lib/create-auth-guard";
import { PublicNavigation } from "@/app/shared/components/public-navigation/public-navigation";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
  beforeLoad: createAuthGuard({
    redirectTo: "/account/dashboard",
    allowUnauthenticated: true,
  }),
});

function RouteComponent() {
  return (
    <div className="w-full relative bg-hero-gradient flex flex-col min-h-screen h-full">
      <PublicNavigation />
      <main className="flex-1 flex flex-col  min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  );
}
