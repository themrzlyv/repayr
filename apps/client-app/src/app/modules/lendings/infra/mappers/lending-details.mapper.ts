import { categoryDetailsMapper } from "@/app/modules/category/infra/mappers/category.mapper";
import type { LendingDetailsResponseType } from "../types/lending-details.response";

export function lendingDetailsMapper(data: LendingDetailsResponseType): any {
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
