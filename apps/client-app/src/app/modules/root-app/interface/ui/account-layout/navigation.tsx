import { SearchIcon } from "@/app/assets/icons";
import { accountInfoQueryOption } from "@/app/modules/account/infra/query-options/account-info.query-option";
import { logoutMutationOption } from "@/app/modules/auth/infra/mutation-options/logout.mutation-option";
import {
  Avatar,
  Button,
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
} from "@/app/modules/transactions/domain/enums/currency.enum";
import { Bell, Dot, DotIcon } from "lucide-react";
import { notificationListQueryOption } from "@/app/modules/notifications/infra/query-options/notification-list.query-option";
import { markReadMutationOption } from "@/app/modules/notifications/infra/mutation-options/mark-read.mutation-option";
import { useMemo } from "react";

export function Navigation() {
  const { data, isLoading } = useQuery(accountInfoQueryOption());
  const { data: notificationData } = useQuery(notificationListQueryOption({}));

  const { mutateAsync: logout } = useMutation(logoutMutationOption());

  const { mutateAsync: updateAccount } = useMutation(
    updateAccountMutationOption()
  );

  const { mutateAsync: markReadyMutation } = useMutation(
    markReadMutationOption()
  );

  const fullName = [data?.firstName, data?.lastName].filter(Boolean).join(" ");

  const hasNewNotification = useMemo(() => {
    if (!notificationData?.notifications) return false;

    return notificationData?.notifications?.some(
      notification => !notification.readAt
    );
  }, [notificationData?.notifications]);

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
        {notificationData && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" size="sm" className="relative  min-w-max">
                {hasNewNotification && (
                  <Dot className="absolute -top-1 right-0 text-red-500" />
                )}
                <Bell />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Notifications"
              onAction={key => markReadyMutation(key as string)}
              variant="flat"
              items={notificationData?.notifications}
            >
              {notificationData?.notifications?.map(notification => {
                return (
                  <DropdownItem
                    key={notification.id}
                    classNames={{
                      base: "max-w-xs relative",
                    }}
                    startContent={
                      <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        color="secondary"
                        name={notification?.data?.name}
                        src={notification?.data?.avatar}
                        size="sm"
                      />
                    }
                  >
                    <div>
                      <span className=" text-xs font-light">
                        {notification.data.message}
                      </span>
                      {notification.readAt === null && (
                        <DotIcon
                          size={40}
                          className="text-red-500 absolute top-2 -right-2"
                        />
                      )}
                    </div>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        )}
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
