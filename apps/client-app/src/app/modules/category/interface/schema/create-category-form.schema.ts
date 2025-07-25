import { z } from "zod";

export const categoryFormSchema = z.object({
  title: z.string().min(3).max(20),
  icon: z.string(),
  type: z.enum(['SYSTEM', 'CUSTOM']).optional()
});

export type CreateCategoryFormSchemaType = z.infer<typeof categoryFormSchema>;
