import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  title?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  content?: React.ReactNode;
  type?: "session-expired" | null;
  onClose?: (() => void) | null;
  openModal: ({
    title,
    content,
    size,
    onClose,
    type,
  }: Omit<ModalState, "isOpen" | "openModal" | "closeModal">) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>(set => ({
  isOpen: false,
  title: null,
  description: null,
  onClose: null,
  type: null,
  onContinue: null,
  openModal: ({
    title,
    content,
    size,
    onClose,
    type,
  }: Omit<ModalState, "isOpen" | "openModal" | "closeModal">) =>
    set({ isOpen: true, title, content, onClose, type, size }),
  closeModal: () =>
    set({
      isOpen: false,
      title: null,
      content: null,
      size: undefined,
      onClose: null,
      type: null,
    }),
}));
