import { debtDetailsMapper } from "@/app/modules/debts/infra/mappers/debt-details.mapper";
import type { CategoryEntity } from "../../domain/entities/category.entity";
import type { CategoryDetailsResponseType } from "../types/category.response";

export function categoryDetailsMapper(
  res: CategoryDetailsResponseType
): CategoryEntity {
  return {
    id: res.id,
    title: res.title,
    icon: res.icon,
    type: res.type,
    createdAt: res.createdAt,
    updatedAt: res.updatedAt,
    ...(res.debts && { debts: res.debts.map(debt => debtDetailsMapper(debt)) }),
  };
}
