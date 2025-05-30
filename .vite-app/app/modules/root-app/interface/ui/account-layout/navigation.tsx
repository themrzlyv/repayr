import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarContent,
} from "@heroui/react";
import { useNavigate } from "react-router";

import { BellIcon, SearchIcon } from "~/assets/icons";
import { QueryId } from "~/lib/query-id";
import { useMeQuery } from "~/modules/account/infra/account.api";
import { useLazyLogoutQuery } from "~/modules/auth/infra/auth.api";
import { ROUTES } from "~/routes";

export function Navigation() {
  const navigate = useNavigate();
  const { data } = useMeQuery(QueryId.AccountMe);

  const [logout] = useLazyLogoutQuery();
  const fullName = [data?.firstName, data?.lastName].filter(Boolean).join(" ");

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.signIn);
  };

  return (
    <Navbar maxWidth="full" className="w-full border-b border-slate-200">
      <NavbarContent justify="start">
        <Input
          type="search"
          placeholder="Search here..."
          endContent={<SearchIcon width={18} height={18} />}
        />
      </NavbarContent>
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={fullName}
              size="sm"
              src={data?.avatar!}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile">
              <p className="font-medium text-md">{fullName}</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
