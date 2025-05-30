import { useAccountContext } from "@/app/modules/account/interface/use-account-context";
import { Navigation } from "./navigation";
import { SideBar } from "./side-bar";
import { useEffect } from "react";

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const { accountAction } = useAccountContext();

  useEffect(() => {
    accountAction.fetchUserInfo();
  },[])
  
  return (
    <div className="w-full min-h-screen flex">
      <SideBar />
      <div className="w-full flex flex-col">
        <Navigation />
        <main className="flex-grow  p-5">{children}</main>
      </div>
    </div>
  );
}
