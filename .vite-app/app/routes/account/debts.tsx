import { QueryId } from "~/lib/query-id";
import { useMeQuery } from "~/modules/account/infra/account.api";

export function meta() {
  return [
    { title: "Debts" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Debts() {
  const { data } = useMeQuery(QueryId.AccountMe);
  console.log("data", data);
  return (
    <div>
      <h2>Debts</h2>
    </div>
  );
}
