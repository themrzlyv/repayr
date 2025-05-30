import clsx from "clsx";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { getMenuItems } from "./data";

import { ExpandIcon } from "~/assets/icons";
import { useMeQuery } from "~/modules/account/infra/account.api";
import { QueryId } from "~/lib/query-id";
import { Navbar, NavbarContent } from "@heroui/react";

export function SideBar() {
  const [isExpandedMenu, setIsExpandedMenu] = useState(true);

  const { data } = useMeQuery(QueryId.AccountMe);

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
    if (!data?.role) return [];

    return getMenuItems({ role: data?.role }).map((item, index) => {
      return (
        <div key={index} className="flex flex-col gap-[2px]">
          {item.subItems.map((subItem, subIndex) => {
            const isSubActive = pathname === subItem.href;
            return (
              <Navlink
                key={subIndex}
                onClick={() => router(subItem.href)}
                className={clsx(
                  "flex items-center gap-2 py-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-slate-100 rounded-lg",
                  isExpandedMenu ? "px-3 justify-start" : "px-0 justify-center",
                  isSubActive && "bg-slate-100",
                )}
              >
                <subItem.icon className="w-5 h-5" />
                {isExpandedMenu && (
                  <p
                    className={clsx(
                      "font-normal text-sm",
                      isSubActive ? "text-black" : "text-gray-600",
                    )}
                  >
                    {subItem.name}
                  </p>
                )}
              </Navlink>
            );
          })}
        </div>
      );
    });
  }, [pathname, router, isExpandedMenu, data?.role]);

  return (
    <div className={menuClasses}>
      <Navbar maxWidth="full">
        <NavbarContent className="py-3">
          <h4 className="text-xl text-black font-sansation font-semibold">
            {isExpandedMenu ? "Repayr" : "R"}
          </h4>
        </NavbarContent>
      </Navbar>
      <aside
        className={clsx(
          "flex-grow flex flex-col justify-between py-10",
          isExpandedMenu ? "px-5" : "px-2",
        )}
      >
        <div className="flex flex-col gap-8">{renderMenuItems}</div>

        <div
          className={clsx(
            "flex items-center",
            isExpandedMenu ? "justify-end" : "justify-center",
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
