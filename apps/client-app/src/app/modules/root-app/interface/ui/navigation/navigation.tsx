import { SearchIcon } from "@/app/assets/icons";
import {
  Avatar,
  Badge,
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
import {
  Currency,
  type CurrencyEnum,
} from "@/app/modules/transactions/domain/enums/currency.enum";
import { Bell, DotIcon } from "lucide-react";
import { useNavigation } from "./use-navigation";
import { useNotifications } from "@/app/modules/notifications/ui/use-notifications";

export function Navigation() {
  const { account, isLoading, fullName, handleLogout, handleChangeCurrency } =
    useNavigation();

  const {
    isOpen,
    toggle,
    markRead,
    renderMessage,
    notifications,
    unreadCount,
  } = useNotifications();

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
        {notifications && (
          <Dropdown
            placement="bottom-end"
            onOpenChange={toggle}
            isOpen={isOpen}
          >
            <DropdownTrigger>
              <Badge
                color="danger"
                content={unreadCount}
                isInvisible={unreadCount === 0}
                shape="circle"
              >
                <Button onClick={toggle} isIconOnly radius="full">
                  <Bell size={24} />
                </Button>
              </Badge>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Notifications"
              onAction={key => markRead(key as string)}
              variant="flat"
              items={notifications}
            >
              {notifications.map(notification => {
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
                      <p className="text-xs font-light">
                        {renderMessage(notification)}
                      </p>
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
                  name={account?.currency}
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={new Set([account?.currency!])}
                selectionMode="single"
                aria-label="Currency Actions"
                onAction={key => handleChangeCurrency(key as CurrencyEnum)}
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
                  src={account?.avatar!}
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
