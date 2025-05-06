import React, { useRef } from "react";
import { Provider } from "react-redux";

import { store, type AppStore } from "~/lib/store";

type Props = {
  children: React.ReactNode;
};

export function StoreProvider({ children }: Props) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return (
    <>
      <Provider store={storeRef.current}>{children}</Provider>
    </>
  );
}
