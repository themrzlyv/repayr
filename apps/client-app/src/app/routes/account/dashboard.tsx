import { useAuthContext } from "@/app/modules/auth/interface/use-auth-context";
import { useAlertModalStore } from "@/app/shared/components/alert-modal/alert-modal.store";
import { Button } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {

  const { authAction } = useAuthContext()

  const { open } = useAlertModalStore();

  return (
    <div>
      Account Dashboard
      <Button
        onClick={() =>
          open({
            title: "hello",
            description: "world",
            onClose: async () => {
              await authAction.logout();
            },
          })
        }
      >
        open
      </Button>
    </div>
  );
}
