import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";
import { router } from "./app/lib/base-router.ts";
import { useRootContext } from "./app/modules/root-app/interface/use-root-context.tsx";
import { useEffect } from "react";
import { Loading } from "./app/shared/components/loading/loading.tsx";
import { SessionStorageService } from "./app/lib/session-storage.service.ts";
import { HeroUIProvider } from "@heroui/react";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { sessionAction, sessionStore } = useRootContext();
  const { isLoading } = sessionStore.sessionData;
  const hasSession = Boolean(SessionStorageService.getUserId());

  useEffect(() => {
    if (hasSession) {
      sessionAction.initialVerifySession();
    }
  }, []);

  if (isLoading && hasSession) {
    return <Loading />;
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  );
}
