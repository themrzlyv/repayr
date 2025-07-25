import { z } from "zod";
import { Currency } from "../../domain/enums/currency.enum";

export const createDebtFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  amount: z.object({
    value: z.string(),
    currency: z.enum(Object.keys(Currency) as [keyof typeof Currency]),
  }),
  category: z.object({
    id: z.string(),
    title: z.string(),
    icon: z.string(),
  }),
  payDate: z.date(),
  lenderId: z.string().optional(),
});

export type CreateDebtFormSchemaType = z.infer<typeof createDebtFormSchema>;
