import { create } from "zustand";

type State = {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  openDrawer: (args: { title?: string; content?: React.ReactNode }) => void;
  closeDrawer: () => void;
};

export const useDrawerStore = create<State>(set => ({
  isOpen: false,
  title: undefined,
  content: undefined,
  openDrawer: ({ title, content }) => set({ isOpen: true, title, content }),
  closeDrawer: () =>
    set({ isOpen: false, title: undefined, content: undefined }),
}));
