import { useDrawerStore } from "@/app/shared/components/drawer/use-drawer.store";
import { Button } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { openDrawer } = useDrawerStore();

  return (
    <div>
      Account Dashboard
      <Button
        onClick={() =>
          openDrawer({
            title: "hello",
          })
        }
      >
        open
      </Button>
    </div>
  );
}
