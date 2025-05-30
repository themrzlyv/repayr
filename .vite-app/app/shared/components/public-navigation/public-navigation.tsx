import React, { useMemo } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";

import { ROUTES } from "~/routes";
import { useSessionContext } from "~/shared/providers/session-provider";
import { useLocation } from "react-router";
import { menuItems } from "~/lib/constants";

export function PublicNavigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { session, isLoading: sessionLoading, isError } = useSessionContext();

  const isSessionError = useMemo(() => {
    return isError || !session?.isAuthenticated;
  }, [isError, session?.isAuthenticated]);

  const renderMenuItems = useMemo(() => {
    if (sessionLoading) {
      return (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      );
    }

    return (
      <Button
        as={Link}
        href={isSessionError ? ROUTES.signIn : ROUTES.dashboard}
        color="secondary"
        variant="flat"
      >
        Sign In
      </Button>
    );
  }, [isSessionError, sessionLoading]);

  return (
    <Navbar
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} href={ROUTES.home}>
          <p className="font-semibold text-black text-xl">Repayr</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <NavbarItem isActive={isActive} key={index}>
              <Link
                color={isActive ? "primary" : "foreground"}
                href={item.path}
              >
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>{renderMenuItems}</NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              href={item.path}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
