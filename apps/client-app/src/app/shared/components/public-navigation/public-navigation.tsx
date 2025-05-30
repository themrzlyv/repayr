import React, { useMemo } from "react";
import { useLocation, Link as RouterLink } from "@tanstack/react-router";

import { menuItems } from "@/app/lib/constants";
import { SessionStorageService } from "@/app/lib/session-storage.service";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link,
} from "@heroui/react";

import { useRootContext } from "@/app/modules/root-app/interface/use-root-context";

export function PublicNavigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrollPosition, setScrollPosition] = React.useState(0);

  const { sessionStore } = useRootContext();

  const { sessionData } = sessionStore;

  const { isLoading: sessionLoading, error, data } = sessionData;

  const hasSession = Boolean(SessionStorageService.getUserId());

  const isSessionError = useMemo(() => {
    return !!error || !data?.session?.isAuthenticated;
  }, [error, data?.session?.isAuthenticated]);

  const renderMenuItem = useMemo(() => {
    if (sessionLoading && hasSession) {
      return (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      );
    }

    return (
      <Button
        as={RouterLink}
        color="success"
        variant="bordered"
        className="text-black bg-secondary-200"
        to={isSessionError ? "/sign-in" : "/account/dashboard"}
      >
        {isSessionError ? "Sign In" : "Dashboard"}
      </Button>
    );
  }, [isSessionError, sessionLoading, hasSession]);

  return (
    <Navbar
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className={scrollPosition > 5 ? "" : "bg-inherit"}
      isBlurred={scrollPosition > 5}
      onScrollPositionChange={position => setScrollPosition(position)}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand as={RouterLink} to={"/"}>
          <Link
            as={RouterLink}
            color="primary"
            className="font-semibold font-sansation text-2xl"
            to="/"
          >
            Repayr
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <Link
            as={RouterLink}
            color="primary"
            className="font-semibold font-sansation text-2xl"
            to="/"
          >
            Repayr
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map(item => {
          return (
            <NavbarItem
              key={item.label}
              isActive={location.pathname === item.path}
            >
              <Link
                as={RouterLink}
                color="foreground"
                className="font-normal"
                to={item.path}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end">{renderMenuItem}</NavbarContent>

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
              href="#"
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
