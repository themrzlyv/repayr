import { useMemo } from "react";
import { useLocation } from "react-router";

import { authRoutes } from "~/lib/constants";
import { useSessionContext } from "~/shared/providers/session-provider";

export function usePublicLayout() {
  const location = useLocation();

  const { session, isLoading: sessionLoading, isSuccess } = useSessionContext();

  const isAuthPath = useMemo(() => {
    return authRoutes.includes(location.pathname);
  }, [location.pathname]);

  const shouldRedirect = useMemo(() => {
    return isSuccess && session?.isAuthenticated && isAuthPath;
  }, [isSuccess, session?.isAuthenticated, isAuthPath]);

  return {
    sessionLoading,
    shouldRedirect,
  };
}
