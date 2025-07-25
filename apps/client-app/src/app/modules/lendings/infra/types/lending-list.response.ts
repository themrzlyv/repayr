import type { PaginationValueObject } from "@/app/shared/types/pagination.value-object";
import type { LendingDetailsResponseType } from "./lending-details.response";

export type LendingListResponseType = {
  lendings: LendingDetailsResponseType[];
  pagination: PaginationValueObject;
};
