import clsx from "clsx";
import { useMemo, useState } from "react";

import { getMenuItems } from "./data";

import { Navbar, NavbarContent, Skeleton } from "@heroui/react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { ExpandIcon } from "@/app/assets/icons";
import { useAccountContext } from "@/app/modules/account/interface/use-account-context";

export function SideBar() {
  const [isExpandedMenu, setIsExpandedMenu] = useState(true);

  const { accountStore } = useAccountContext();

  const { data, isLoading } = accountStore.accountData;

  const router = useNavigate();
  const { pathname } = useLocation();

  const toggleMenu = () => setIsExpandedMenu(!isExpandedMenu);

  const menuClasses = clsx([
    "flex",
    "flex-col",
    "border-r",
    "border-slate-200",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "overflow-hidden",
    isExpandedMenu ? "w-3/12" : "w-16",
  ]);

  const renderMenuItems = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 2 }).map((_, index) => {
        return (
          <div key={index} className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, subIndex) => {
              return <Skeleton key={subIndex} className="w-full h-8" />;
            })}
          </div>
        );
      });
    }

    if (!data?.role) return [];

    return getMenuItems({ role: data?.role }).map((item, index) => {
      return (
        <div key={index} className="flex flex-col gap-[2px]">
          {item.subItems.map((subItem, subIndex) => {
            const isSubActive = pathname === subItem.href;
            return (
              <Link
                key={subIndex}
                to={subItem.href}
                className={clsx(
                  "flex items-center gap-2 py-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-slate-100 rounded-lg",
                  isExpandedMenu ? "px-3 justify-start" : "px-0 justify-center",
                  isSubActive && "bg-slate-100"
                )}
              >
                <subItem.icon className="w-5 h-5" />
                {isExpandedMenu && (
                  <p
                    className={clsx(
                      "font-normal text-sm",
                      isSubActive ? "text-black" : "text-gray-600"
                    )}
                  >
                    {subItem.name}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      );
    });
  }, [pathname, router, isExpandedMenu, data?.role, isLoading]);

  return (
    <div className={menuClasses}>
      <Navbar maxWidth="full">
        <NavbarContent className="py-3">
          <Link
            to="/"
            className="text-xl text-black font-sansation font-semibold"
          >
            {isExpandedMenu ? "Repayr" : "R"}
          </Link>
        </NavbarContent>
      </Navbar>
      <aside
        className={clsx(
          "flex-grow flex flex-col justify-between bg-background-500 py-10",
          isExpandedMenu ? "px-5" : "px-2"
        )}
      >
        <div className="flex flex-col gap-8">{renderMenuItems}</div>

        <div
          className={clsx(
            "flex items-center",
            isExpandedMenu ? "justify-end" : "justify-center"
          )}
        >
          <div onClick={toggleMenu} className="cursor-pointer">
            <ExpandIcon width={20} height={20} />
          </div>
        </div>
      </aside>
    </div>
  );
}
