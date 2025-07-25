import { z } from "zod";
import { Currency } from "../../domain/enums/currency.enum";

export const payDebtFormSchema = z.object({
  amount: z.object({
    value: z.string(),
    currency: z.enum(Object.keys(Currency) as [keyof typeof Currency]),
  }),
});

export type PayDebtFormSchemaType = z.infer<typeof payDebtFormSchema>;
