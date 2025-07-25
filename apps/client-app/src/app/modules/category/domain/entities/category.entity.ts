import type { DebtEntity } from "@/app/modules/debts/domain/entities/debt.entity";
import type { CategoryTypeEnum } from "../enums/category-type.enum";

export type CategoryEntity = {
  id: string;
  title: string;
  icon: string;
  type: CategoryTypeEnum;
  createdAt: string;
  updatedAt: string;
  debts: Omit<DebtEntity, "category">[];
};
