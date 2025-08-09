import { z } from "zod";
import { Currency } from "../../domain/enums/currency.enum";

export const createTransactionFormSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  amount: z.object({
    value: z.string(),
    currency: z.enum(Object.keys(Currency) as [keyof typeof Currency]),
  }),
  categoryId: z.string(),
  dueDate: z.date(),
  counterpartyId: z.string().optional(),
});

export type CreateTransactionFormSchemaType = z.infer<
  typeof createTransactionFormSchema
>;
