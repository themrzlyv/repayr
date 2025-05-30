import { createSlice } from "@reduxjs/toolkit";

type ModalState = {
  isOpen: boolean;
  title: string | null;
  description: string | null;
  content: React.ReactNode | null;
  footer: React.ReactNode | null;
  onClose: (() => void) | null;
  intent: "logout" | null;
};

const initialState: ModalState = {
  isOpen: false,
  title: null,
  description: null,
  content: null,
  footer: null,
  onClose: null,
  intent: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.content = action.payload.content;
      state.footer = action.payload.footer;
      state.onClose = action.payload.onClose;
      state.intent = action.payload.intent;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = null;
      state.description = null;
      state.content = null;
      state.footer = null;
      state.onClose = null;
      state.intent = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
