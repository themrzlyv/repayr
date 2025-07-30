import React, { useMemo } from "react";
import { useLocation, Link as RouterLink } from "@tanstack/react-router";

import { menuItems } from "@/app/lib/constants";

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

import { useQuery } from "@tanstack/react-query";
import { accountInfoQueryOption } from "@/app/modules/account/infra/query-options/account-info.query-option";

export function PublicNavigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrollPosition, setScrollPosition] = React.useState(0);

  const {
    isLoading: sessionLoading,
    error,
    data,
  } = useQuery(accountInfoQueryOption());

  const hasSession = Boolean(data?.id);

  const isSessionError = useMemo(() => {
    return !!error || !data?.id;
  }, [error, data?.id]);

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
        <NavbarBrand
          as={RouterLink}
          className="font-semibold font-sansation text-2xl"
          to={"/"}
        >
          Repayr
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand
          as={RouterLink}
          to="/"
          className="font-semibold font-sansation text-2xl"
        >
          Repayr
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
              as={RouterLink}
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              to={item.path}
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
