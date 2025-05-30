import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";

import { Navigation } from "./navigation";
import { SideBar } from "./side-bar";
import { useAccountLayout } from "./use-account-layout";

import { ROUTES } from "~/routes";

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { shouldRedirect, isLoadingSession, isSessionError } =
    useAccountLayout();

  useLayoutEffect(() => {
    if (shouldRedirect) {
      navigate(ROUTES.signIn, {
        replace: true,
      });
    }
  }, [shouldRedirect, navigate]);

  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isSessionError) {
    return null;
  }

  return (
    <div className="w-full min-h-screen flex">
      <SideBar />
      <div className="w-full flex flex-col">
        <Navigation />
        <main className="flex-grow p-5">{children}</main>
      </div>
    </div>
  );
}
