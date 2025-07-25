import type { CategoryTypeEnum } from "../../domain/enums/category-type.enum";

export type CategoryListQueryInput = {
  filter: CategoryTypeEnum | 'ALL' | 'USED';
};