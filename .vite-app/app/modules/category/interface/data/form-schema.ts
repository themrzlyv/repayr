import { z } from "zod";

export const categoryFormSchema = z.object({
  title: z.string().min(3).max(20),
  icon: z.string(),
});
