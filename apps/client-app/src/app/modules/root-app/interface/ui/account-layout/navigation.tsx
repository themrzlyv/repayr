import { SearchIcon } from "@/app/assets/icons";
import { useAccountContext } from "@/app/modules/account/interface/use-account-context";
import { useAuthContext } from "@/app/modules/auth/interface/use-auth-context";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarContent,
  Skeleton,
} from "@heroui/react";

export function Navigation() {
  const { authAction } = useAuthContext();
  const { accountStore } = useAccountContext();

  const { data, isLoading } = accountStore.accountData;

  const fullName = [data?.firstName, data?.lastName].filter(Boolean).join(" ");

  const handleLogout = async () => {
    await authAction.logout();
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
        {isLoading ? (
          <Skeleton className="w-10 h-10 rounded-full my-2" />
        ) : (
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
        )}
      </NavbarContent>
    </Navbar>
  );
}
