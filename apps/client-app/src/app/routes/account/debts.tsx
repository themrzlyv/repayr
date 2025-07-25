import { DebtsPage } from "@/app/modules/debts/ui/debts.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/debts")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DebtsPage />;
}
