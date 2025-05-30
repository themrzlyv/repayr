import { useMemo } from "react";

import { useSessionContext } from "~/shared/providers/session-provider";

export function useAccountLayout() {
  const { session, isLoading, isSuccess, isError } = useSessionContext();

  const shouldRedirect = useMemo(() => {
    return (isSuccess && session && !session.isAuthenticated) || isError;
  }, [isSuccess, session, isError]);

  const isLoadingSession = useMemo(() => {
    return isLoading || !isSuccess;
  }, [isLoading, isSuccess]);

  const isSessionError = useMemo(() => {
    return isError || !session?.isAuthenticated;
  }, [isError, session?.isAuthenticated]);

  return {
    shouldRedirect,
    isLoadingSession,
    isSessionError,
  };
}
