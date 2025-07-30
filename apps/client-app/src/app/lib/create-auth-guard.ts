import {
  isRedirect,
  redirect,
  type ParsedLocation,
} from "@tanstack/react-router";
import { authRoutes } from "@/app/lib/constants";
import { useAuthStore } from "../modules/auth/interface/stores/use-auth.store";

type AuthGuardArgs = {
  allowUnauthenticated?: boolean;
};

export function createAuthGuard({
  allowUnauthenticated = false,
}: AuthGuardArgs) {
  return async ({ location }: { location: ParsedLocation }) => {
    try {
      const { accessToken } = useAuthStore.getState();
      const currentPath = location.pathname;
      const isAuthed = Boolean(accessToken);

      const isAccountPath = currentPath.startsWith("/account");
      const isAuthRoute = authRoutes.includes(currentPath);

      // ✅ Authenticated users trying to access /sign-in, /sign-up, etc.
      if (allowUnauthenticated && isAuthed && isAuthRoute) {
        throw redirect({ to: "/account/dashboard" });
      }

      // ✅ Unauthenticated users trying to access protected /account routes (redundancy check)
      if (!allowUnauthenticated && !isAuthed && isAccountPath) {
        throw redirect({ to: "/" });
      }
    } catch (err) {
      if (isRedirect(err)) throw err;
      return;
    }
  };
}
