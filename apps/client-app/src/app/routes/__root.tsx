import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Modal } from "../shared/components/modal/modal";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Drawer } from "../shared/components/drawer/drawer";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootApp,
});

function RootApp() {
  return (
    <>
      <Outlet />
      <Drawer />
      <Modal />
      <TanStackRouterDevtools />
      <ReactQueryDevtools position="bottom" />
    </>
  );
}
