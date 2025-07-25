import { CategoriesPage } from "@/app/modules/category/ui/categories.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/categories")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CategoriesPage />;
}
