import {
  AccountIcon,
  BellIcon,
  IncomeIcon,
  MenuIcon,
  OutcomeIcon,
  ReportsIcon,
  SettingsIcon,
  SupportIcon,
  WalletIcon,
} from "~/assets/icons";
import { AccountRoleEnum } from "~/modules/account/domain/enums/account-role.enum";

export const getMenuItems = ({ role }: { role: AccountRoleEnum }) => {
  const menuOptions = [
    {
      paragraph: "Menu",
      subItems: [
        {
          name: "Dashboard",
          icon: MenuIcon,
          href: "/account/dashboard",
        },
        {
          name: "Debts",
          icon: OutcomeIcon,
          href: "/account/debts",
        },
        {
          name: "My Wallet",
          icon: WalletIcon,
          href: "/account/wallet",
        },
        {
          name: "Loans",
          icon: IncomeIcon,
          href: "/account/loans",
        },
        {
          name: "Data and reports",
          icon: ReportsIcon,
          href: "/account/reports",
        },
      ],
    },
    {
      paragraph: "Settings",
      subItems: [
        role === AccountRoleEnum.ADMIN && {
          name: "Admin",
          href: "/admin",
          icon: SettingsIcon,
        },
        {
          name: "Account",
          href: "/account",
          icon: AccountIcon,
        },
        {
          name: "Notifications",
          href: "/notifications",
          icon: BellIcon,
        },
        {
          name: "Support",
          href: "/support",
          icon: SupportIcon,
        },
      ],
    },
  ];

  return menuOptions.map((item) => ({
    ...item,
    subItems: item.subItems.filter((subItem) => !!subItem),
  }));
};
