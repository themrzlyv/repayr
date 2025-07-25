import {
  isRedirect,
  redirect,
  type ParsedLocation,
} from "@tanstack/react-router";
import { authRoutes } from "@/app/lib/constants";
import { SessionStorageService } from "./session-storage.service";
import type { QueryClient } from "@tanstack/react-query";
import { verifySessionQueryOption } from "../modules/root-app/infra/query-options/verify-session.query-option";

type AuthGuardArgs = {
  redirectTo: string;
  allowUnauthenticated?: boolean;
};

export function createAuthGuard({
  redirectTo,
  allowUnauthenticated = false,
}: AuthGuardArgs) {
  return async ({
    location,
    context: { queryClient },
  }: {
    location: ParsedLocation;
    context: { queryClient: QueryClient };
  }) => {
    try {
      const currentPath = location.pathname;
      const hasSession = Boolean(SessionStorageService.getUserId());

      const isAccountPath = currentPath.startsWith("/account");
      const isAuthRoute = authRoutes.includes(currentPath);

      // ✅ Unauthenticated users trying to access protected /account routes
      if (!hasSession && !allowUnauthenticated && isAccountPath) {
        throw redirect({ to: redirectTo });
      }

      if (!hasSession) return;

      const sessionData = await queryClient.ensureQueryData(
        verifySessionQueryOption()
      );

      const isAuthed = sessionData?.session?.isAuthenticated;

      // ✅ Authenticated users trying to access /sign-in, /sign-up, etc.
      if (allowUnauthenticated && isAuthed && isAuthRoute) {
        throw redirect({ to: "/account/dashboard" });
      }

      // ✅ Unauthenticated users trying to access protected /account routes (redundancy check)
      if (!allowUnauthenticated && !isAuthed && isAccountPath) {
        SessionStorageService.clear();
        throw redirect({ to: "/" });
      }
    } catch (err) {
      if (isRedirect(err)) throw err;
      return;
    }
  };
}
