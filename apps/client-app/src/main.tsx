import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";
import { router } from "./app/lib/base-router.ts";
import { Loading } from "./app/shared/components/loading/loading.tsx";
import { SessionStorageService } from "./app/lib/session-storage.service.ts";
import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { verifySessionQueryOption } from "./app/modules/root-app/infra/query-options/verify-session.query-option.ts";
import { queryClient } from "./app/lib/query-client.ts";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { isLoading, isFetched } = useQuery(verifySessionQueryOption());
  const hasSession = Boolean(SessionStorageService.getUserId());

  if (isLoading && hasSession && !isFetched) {
    return <Loading />;
  }

  return (
    <>
      <RouterProvider
        router={router}
        context={{ queryClient }}
        defaultPendingComponent={Loading}
      />
    </>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
