import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  title?: string | null;
  description?: string | null;
  onClose?: (() => void) | null;
  onContinue?: (() => void) | null;
  open: ({
    title,
    description,
    onClose,
  }: Omit<ModalState, "isOpen" | "open" | "close">) => void;
  close: () => void;
};

export const useAlertModalStore = create<ModalState>(set => ({
  isOpen: false,
  title: null,
  description: null,
  onClose: null,
  onContinue: null,
  open: ({
    title,
    description,
    onClose,
    onContinue,
  }: Omit<ModalState, "isOpen" | "open" | "close">) =>
    set({ isOpen: true, title, description, onClose, onContinue }),
  close: () =>
    set({
      isOpen: false,
      title: null,
      description: null,
      onClose: null,
      onContinue: null,
    }),
}));
