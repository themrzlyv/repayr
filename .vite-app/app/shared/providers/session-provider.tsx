import { createContext, useContext } from "react";
import { useLoaderData } from "react-router";
import { SessionLoaderValueObject } from "~/modules/root-app/domain/value-objects/session-loader.value-object";
import { SessionValueObject } from "~/modules/root-app/domain/value-objects/session.value-object";
import { useVerifySessionQuery } from "~/modules/root-app/infra/session.api";

type SessionContextType = {
  session: SessionValueObject | undefined;
  csrfToken: string | undefined;
  isLoading: boolean | undefined;
  isError: boolean | undefined;
  isSuccess: boolean | undefined;
};

const SessionContext = createContext<SessionContextType>({
  session: undefined,
  csrfToken: undefined,
  isLoading: undefined,
  isError: undefined,
  isSuccess: undefined,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { isValidSession } = useLoaderData<SessionLoaderValueObject>();

  const { data, isLoading, isSuccess, isError } = useVerifySessionQuery(
    undefined,
    {
      skip: !isValidSession,
    },
  );

  return (
    <SessionContext.Provider
      value={{
        session: data?.session,
        csrfToken: data?.csrfToken,
        isLoading,
        isError,
        isSuccess,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
