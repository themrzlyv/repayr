import type { Key } from "react";

export type DebtListSortValueObject = {
  sortField: Key;
  sortDirection: "asc" | "desc";
};