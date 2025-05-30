import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/debts")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/account/debts"!</div>;
}
