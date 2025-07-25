import { z } from "zod";

export const updateCategoryFormSchema = z.object({
  title: z.string().min(3).max(20),
  icon: z.string(),
  id: z.string(),
});

export type UpdateCategoryFormSchemaType = z.infer<typeof updateCategoryFormSchema>;
