import { useNavigate } from "react-router";

import { closeModal } from "./modal.slice";

import { useAppDispatch, useAppSelector } from "~/lib/store";
import { authApi } from "~/modules/auth/infra/auth.api";
import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

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
    <HeroModal isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader>
          {title && <h4>{title}</h4>}
          {description && <p>{description}</p>}
        </ModalHeader>
        <ModalBody>{content}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </HeroModal>
  );
}
