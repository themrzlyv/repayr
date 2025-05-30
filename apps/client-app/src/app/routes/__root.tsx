import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { AlertModal } from "../shared/components/alert-modal/alert-modal";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootApp,
});

function RootApp() {
  return (
    <>
      <Outlet />
      {/* <AlertModal /> */}
      <TanStackRouterDevtools />
    </>
  );
}
