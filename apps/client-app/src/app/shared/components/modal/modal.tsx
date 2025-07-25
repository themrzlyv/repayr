import {
  Modal as HRModal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/modal";
import { useModalStore } from "./use-modal.store";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { logoutMutationOption } from "@/app/modules/auth/infra/mutation-options/logout.mutation-option";

export function Modal() {
  const { isOpen, title, content, onClose, closeModal, type, size } =
    useModalStore();

  const { mutateAsync: logoutMutation } = useMutation(logoutMutationOption());

  const handleClose = useCallback(async () => {
    if (onClose) {
      onClose();
    }

    if (type === "session-expired") {
      await logoutMutation();
    }

    closeModal();
  }, [closeModal, onClose, type]);

  return (
    <HRModal size={size} isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>
          {title && <p className="font-medium">{title}</p>}
        </ModalHeader>
        <ModalBody>{content}</ModalBody>
      </ModalContent>
    </HRModal>
  );
}
