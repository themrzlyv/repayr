import { SearchIcon } from "@/app/assets/icons";
import { accountInfoQueryOption } from "@/app/modules/account/infra/query-options/account-info.query-option";
import { logoutMutationOption } from "@/app/modules/auth/infra/mutation-options/logout.mutation-option";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateAccountMutationOption } from "@/app/modules/account/infra/mutation-options/update-account.mutation-option";
import {
  Currency,
  type CurrencyEnum,
} from "@/app/modules/debts/domain/enums/currency.enum";

export function Navigation() {
  const { data, isLoading } = useQuery(accountInfoQueryOption());

  const { mutateAsync: logout } = useMutation(logoutMutationOption());

  const { mutateAsync: updateAccount } = useMutation(
    updateAccountMutationOption()
  );

  const fullName = [data?.firstName, data?.lastName].filter(Boolean).join(" ");

  const handleLogout = async () => {
    await logout();
  };

  const handleChangeCurrecy = async (currency: CurrencyEnum) => {
    await updateAccount({ currency });
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
          <>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={data?.currency}
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={new Set([data?.currency!])}
                selectionMode="single"
                aria-label="Currency Actions"
                onAction={key => handleChangeCurrecy(key as CurrencyEnum)}
                variant="flat"
              >
                <DropdownItem key={Currency.EUR}>Eur</DropdownItem>
                <DropdownItem key={Currency.USD}>USD</DropdownItem>
                <DropdownItem key={Currency.AZN}>AZN</DropdownItem>
              </DropdownMenu>
            </Dropdown>

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
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
