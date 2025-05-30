import { useLayoutEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router";

import { usePublicLayout } from "./use-public-layout";

import { ROUTES } from "~/routes";
import { Button } from "@heroui/react";
import { PublicNavigation } from "~/shared/components/public-navigation/public-navigation";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const { sessionLoading, shouldRedirect } = usePublicLayout();

  useLayoutEffect(() => {
    if (shouldRedirect) {
      navigate(ROUTES.dashboard, { replace: true });
    }
  }, [shouldRedirect, navigate]);

  if (sessionLoading || shouldRedirect) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="w-full  relative flex flex-col min-h-screen h-full">
      <PublicNavigation />

      <main className="overflow-scroll flex-1">{children}</main>
    </div>
  );
}
