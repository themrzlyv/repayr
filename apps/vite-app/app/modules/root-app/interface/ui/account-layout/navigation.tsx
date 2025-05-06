import { useNavigate } from "react-router";

import { BellIcon, SearchIcon } from "~/assets/icons";
import { QueryId } from "~/lib/query-id";
import { useMeQuery } from "~/modules/account/infra/account.api";
import { useLazyLogoutQuery } from "~/modules/auth/infra/auth.api";
import { ROUTES } from "~/routes";

export function Navigation() {
  const navigate = useNavigate();
  const { data } = useMeQuery(QueryId.AccountMe);

  const [logout] = useLazyLogoutQuery();
  const fullName = [data?.firstName, data?.lastName].filter(Boolean).join(" ");

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.signIn);
  };

  return (
    <nav className="w-full h-[4.5rem] flex items-center justify-between px-5 border-b border-slate-200">
      <div className="w-8/12">
        <div className="w-3/4">
          <input type="search" placeholder="Search here..." />
          <SearchIcon width={18} height={18} />
        </div>
      </div>
      <div className="w-4/12 flex items-center justify-evenly">
        <div className="flex gap-2">
          {data?.avatar && (
            <div className="flex items-center">
              <img
                width={36}
                height={20}
                src={data.avatar}
                alt="avatar"
                className="rounded-full"
              />
            </div>
          )}
          <div>
            <h4 className="text-black font-medium text-sm capitalize">
              {fullName}
            </h4>
            <p className="text-black font-light text-xs">{data?.email}</p>
          </div>
        </div>
        <div>
          <button>
            <BellIcon
              width={24}
              height={24}
              color="#6a7282"
              className="cursor-pointer"
            />
          </button>
        </div>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}
