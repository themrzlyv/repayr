import type { UseMutationOptions } from "@tanstack/react-query";
import { CategoryAdapter } from "../category.adapter";
import { queryClient } from "@/app/lib/query-client";

export function removeCategorMutationOption(
  options?: UseMutationOptions<void, unknown, string>
): UseMutationOptions<void, unknown, string> {
  return {
    mutationFn: (id: string) =>
      CategoryAdapter.getInstance().removeCategory(id),
    mutationKey: ["update-category"],
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  };
}
