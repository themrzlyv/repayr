import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";
import { router } from "./app/lib/base-router.ts";
import { Loading } from "./app/shared/components/loading/loading.tsx";
import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient } from "./app/lib/query-client.ts";
import { refreshTokenQueryOption } from "./app/modules/auth/infra/query-options/refresh-token.query-option.ts";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { isLoading, isFetching } = useQuery(refreshTokenQueryOption());

  if (isLoading || isFetching) {
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
