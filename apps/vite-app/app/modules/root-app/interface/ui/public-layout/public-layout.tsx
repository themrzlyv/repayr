import { useLayoutEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router";

import { usePublicLayout } from "./use-public-layout";

import { ROUTES } from "~/routes";
import { Button } from "~/shared/ui/button";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const {
    sessionLoading,
    isSessionError,
    userLoading,
    userFullName,
    shouldRedirect,
  } = usePublicLayout();

  useLayoutEffect(() => {
    if (shouldRedirect) {
      navigate(ROUTES.dashboard, { replace: true });
    }
  }, [shouldRedirect, navigate]);

  const renderMenuItems = useMemo(() => {
    if (!isSessionError && userLoading) {
      return (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      );
    }

    return (
      <Button asChild variant={isSessionError ? "default" : "ghost"}>
        <NavLink to={isSessionError ? ROUTES.signIn : ROUTES.dashboard}>
          {isSessionError ? "Sign In" : userFullName}
        </NavLink>
      </Button>
    );
  }, [isSessionError, userLoading, userFullName]);

  if (sessionLoading || shouldRedirect) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-74px)] relative">
      <nav className="sticky top-0 z-50 bg-white w-full shadow-xs">
        <div className="py-5 mx-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <NavLink to={ROUTES.home} className="text-2xl font-bold">
              Repayr
            </NavLink>
            <NavLink to="/features" className="font-medium text-md">
              Features
            </NavLink>
            <NavLink to="/about" className="font-medium text-md">
              About
            </NavLink>
            <NavLink to="/contact" className="font-medium text-md">
              Contact
            </NavLink>
          </div>
          <div className="flex items-center gap-5">{renderMenuItems}</div>
        </div>
      </nav>
      <main className="mx-20 h-full">{children}</main>
    </div>
  );
}
