import { Navigation } from "./navigation";
import { SideBar } from "./side-bar";

export function AccountLayout({ children }: { children: React.ReactNode }) {
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
