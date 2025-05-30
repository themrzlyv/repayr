import { z } from "zod";

export const createDebtFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  amount: z.number(),
  category: z.object({
    id: z.string(),
    title: z.string(),
    icon: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  payDate: z.date(),
});

export type CreateDebtFormType = z.infer<typeof createDebtFormSchema>;

export type UpdateDebtFormType = CreateDebtFormType & { id: string };
