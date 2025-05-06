import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TokenState = {
  csrfToken: string | undefined;
};

const initialState: TokenState = {
  csrfToken: undefined,
};

export const tokenSlice = createSlice({
  name: "tokenSlice",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{ csrfToken: string }>) => {
      state.csrfToken = action.payload.csrfToken;
    },
    clearToken: (state) => {
      state.csrfToken = undefined;
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;
