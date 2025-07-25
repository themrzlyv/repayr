export const CategoryType = {
  SYSTEM: "SYSTEM",
  CUSTOM: "CUSTOM",
} as const;

export type CategoryTypeEnum = (typeof CategoryType)[keyof typeof CategoryType];
