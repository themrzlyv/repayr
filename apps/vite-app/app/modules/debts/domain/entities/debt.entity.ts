import { CategoryEntity } from "@src/modules/category/domain/entities/category.entity";

export type DebtEntity = {
  id: string;
  name: string;
  description: string;
  amount: number;
  category: CategoryEntity;
  payDate: Date;
};
