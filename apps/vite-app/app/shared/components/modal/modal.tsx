import { useNavigate } from "react-router";

import { closeModal } from "./modal.slice";

import { useAppDispatch, useAppSelector } from "~/lib/store";
import { authApi } from "~/modules/auth/infra/auth.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/shared/ui/dialog";

export function Modal() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, title, description, content, footer, onClose, intent } =
    useAppSelector((state) => state.modal);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    if (intent === "logout") {
      dispatch(authApi.endpoints.logout.initiate()).then(() => {
        navigate("/sign-in");
      });
    }
    dispatch(closeModal());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
