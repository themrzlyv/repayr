import type { PaginationValueObject } from "@/app/shared/types/pagination.value-object";
import type { DebtDetailsResponseType } from "./debt-details.response";

export type DebtListResponseType = {
  debts: DebtDetailsResponseType[];
  pagination: PaginationValueObject;
};
