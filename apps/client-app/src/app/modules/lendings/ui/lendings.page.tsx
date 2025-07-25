import { useQuery } from "@tanstack/react-query";
import { lendingListQueryOption } from "../infra/query-options/lending-list.query-option";

export function LendingsPage() {
  const { data } = useQuery(
    lendingListQueryOption({
      page: 1,
      perPage: 10,
    })
  );

  console.log(data, "data");

  return (
    <div>
      <h1>Lendings</h1>
    </div>
  );
}
