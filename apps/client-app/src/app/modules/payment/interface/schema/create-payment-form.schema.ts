import { z } from "zod";
import { Currency } from "../../../transactions/domain/enums/currency.enum";

export const createPaymentFormSchema = z.object({
  amount: z.object({
    value: z.string(),
    currency: z.enum(Object.keys(Currency) as [keyof typeof Currency]),
  }),
  debtId: z.string(),
  transactionId: z.string(),
});

export type CreatePaymentFormSchemaType = z.infer<typeof createPaymentFormSchema>;
