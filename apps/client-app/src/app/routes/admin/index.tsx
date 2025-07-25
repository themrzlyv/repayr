import { AdminPage } from "@/app/modules/admin/ui/admin.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminPage />;
}
