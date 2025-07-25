import { LendingsPage } from "@/app/modules/lendings/ui/lendings.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/lendings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LendingsPage />;
}
