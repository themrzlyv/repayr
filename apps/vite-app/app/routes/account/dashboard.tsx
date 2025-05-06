import { NavLink } from "react-router";

import {
  useDeleteSessionMutation,
  useGetSessionsQuery,
  useVerifySessionQuery,
} from "~/modules/root-app/infra/session.api";
import { Button } from "~/shared/ui/button";

export function meta() {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Dashboard() {
  const { data } = useGetSessionsQuery();
  const { data: currentSession } = useVerifySessionQuery();
  const [deleteSession] = useDeleteSessionMutation();

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
  };

  return (
    <div>
      <h2>Home</h2>
      {data?.sessions.map((session) => (
        <div key={session.id} className="border p-3 w-max">
          <h3> Browser: {session.metadata.device.browser}</h3>
          <p> System: {session.metadata.device.os}</p>
          <p> Laptop type: {session.metadata.device.type}</p>
          <p>Coountry: {session.metadata.location.country}</p>
          <p>City: {session.metadata.location.city}</p>
          <p>EXPIRE: {session.expire}</p>
          {currentSession?.session?.id !== session.id && (
            <Button onClick={() => handleDeleteSession(session.id)}>
              Remove session
            </Button>
          )}
        </div>
      ))}
      <NavLink to="/account/debts">Debts</NavLink>
    </div>
  );
}
