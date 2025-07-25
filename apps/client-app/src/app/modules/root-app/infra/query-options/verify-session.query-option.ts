import { queryOptions } from "@tanstack/react-query";
import { SessionAdapter } from "../session.adapter";
import { SessionStorageService } from "@/app/lib/session-storage.service";

export function verifySessionQueryOption() {
  return queryOptions({
    queryKey: ["verifySession"],
    queryFn: () => SessionAdapter.getInstance().verifySession(),
    enabled: Boolean(SessionStorageService.getUserId()),
    staleTime: Infinity,
  });
}
