export const AccountRoles = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type AccountRoleEnum = (typeof AccountRoles)[keyof typeof AccountRoles];
