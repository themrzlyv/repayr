import { z } from "zod";

import { categoryFormSchema } from "../../interface/data/form-schema";

export type CategoryFormType = z.infer<typeof categoryFormSchema>;
