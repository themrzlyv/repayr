export const CategorySort = {
  ALL: "ALL",
  USED: "USED",
} as const;

export type CategorySortEnum = (typeof CategorySort)[keyof typeof CategorySort];
