import { combineReducers, configureStore, type Action } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { accountApi } from "~/modules/account/infra/account.api";
import { authApi } from "~/modules/auth/infra/auth.api";
import { sessionApi } from "~/modules/root-app/infra/session.api";
import { tokenSlice } from "~/modules/root-app/interface/store/token.slice";
import { modalSlice } from "~/shared/components/modal/modal.slice";

const appReducer = combineReducers({
  modal: modalSlice.reducer,
  token: tokenSlice.reducer,

  [authApi.reducerPath]: authApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [sessionApi.reducerPath]: sessionApi.reducer,
  // [categoryApi.reducerPath]: categoryApi.reducer,
  // [debtApi.reducerPath]: debtApi.reducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: Action,
) => {
  if (authApi.endpoints.logout.matchFulfilled(action)) {
    return appReducer(undefined, { type: "RESET_STATE" });
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      accountApi.middleware,
      sessionApi.middleware,
      // categoryApi.middleware,
      // debtApi.middleware
    ),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
