import { categoryDetailsMapper } from "@/app/modules/category/infra/mappers/category.mapper";
import type { DebtEntity } from "../../domain/entities/debt.entity";
import type { DebtDetailsResponseType } from "../types/debt-details.response";

export function debtDetailsMapper(data: DebtDetailsResponseType): DebtEntity {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    amount: data.amount,
    status: data.status,
    ...(data.category && { category: categoryDetailsMapper(data.category) }),
    payDate: new Date(data.payDate),
    payments: data.payments,
    totalPayments: data.totalPayments,
    lending: data.lending,
  };
}
