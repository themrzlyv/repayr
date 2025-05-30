import { SignUpPage } from "@/app/modules/auth/interface/ui/sign-up/sign-up.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpPage />;
}
