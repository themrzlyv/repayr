import { useMemo } from "react";
import { useLocation } from "react-router";

import { authRoutes } from "~/lib/constants";
import { QueryId } from "~/lib/query-id";
import { useMeQuery } from "~/modules/account/infra/account.api";
import { useSessionContext } from "~/shared/providers/session-provider";

export function usePublicLayout() {
  const location = useLocation();

  const {
    session,
    isLoading: sessionLoading,
    isSuccess,
    isError,
  } = useSessionContext();

  const isAuthPath = useMemo(() => {
    return authRoutes.includes(location.pathname);
  }, [location.pathname]);

  const shouldRedirect = useMemo(() => {
    return isSuccess && session?.isAuthenticated && isAuthPath;
  }, [isSuccess, session?.isAuthenticated, isAuthPath]);

  const isSessionError = useMemo(() => {
    return isError || !session?.isAuthenticated;
  }, [isError, session?.isAuthenticated]);

  const { data: userData, isLoading: userLoading } = useMeQuery(
    QueryId.AccountMe,
    {
      skip: sessionLoading || !session?.isAuthenticated,
    },
  );

  const userFullName = useMemo(() => {
    return [userData?.firstName, userData?.lastName].filter(Boolean).join(" ");
  }, [userData?.firstName, userData?.lastName]);

  return {
    isSessionError,
    sessionLoading,
    userLoading,
    userFullName,
    shouldRedirect,
  };
}
