import type { CategoryTypeEnum } from "../../domain/enums/category-type.enum";
import type { DebtDetailsResponseType } from "@/app/modules/debts/infra/types/debt-details.response";

export type CategoryDetailsResponseType = {
  id: string;
  title: string;
  icon: string;
  type: CategoryTypeEnum;
  createdAt: string;
  updatedAt: string;
  debts: DebtDetailsResponseType[]
};
