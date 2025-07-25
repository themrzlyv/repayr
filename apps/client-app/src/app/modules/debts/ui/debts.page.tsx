import { Button } from "@heroui/react";
import { DownloadIcon } from "@/app/assets/icons";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "react-icons/ai";
import { AddOrUpdateDebt } from "./add-or-update-debt/add-or-update-debt";
import { useDrawerStore } from "@/app/shared/components/drawer/use-drawer.store";
import { categoriesQueryOption } from "../../category/infra/query-options/categories.query-option";
import { DebtsTable } from "./debts-table/debts-table";
import { categoriesSummaryQueryOption } from "../../category/infra/query-options/categories-summary.query-option";

export function DebtsPage() {
  const { openDrawer } = useDrawerStore();

  const { data } = useQuery(categoriesQueryOption({ filter: "USED" }));

  const { data: categoriesTotal } = useQuery(categoriesSummaryQueryOption());

  const handleOpenAddDebtModal = () => {
    openDrawer({
      title: "Add Debt",
      content: <AddOrUpdateDebt />,
    });
  };

  return (
    <div className="w-full h-full flex flex-col  gap-6">
      <div className="w-full  flex items-center gap-4">
        {data?.categories.map((category, index) => {
          const Icon = Icons[category.icon as keyof typeof Icons];
          return (
            <div
              key={index}
              className="border bg-white border-slate-200 h-36 flex-1 rounded-md p-4 flex flex-col justify-between"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full shadow-sm overflow-hidden">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-black text-lg font-bold">
                  {categoriesTotal?.[category.id]?.currency}
                  {categoriesTotal?.[category.id]?.total}
                </h4>
                <div className="flex gap-1 items-center">
                  <p className="text-gray-500 text-sm font-light">
                    {category.title}
                  </p>
                  {category.type === "SYSTEM" && (
                    <span className="text-gray-500 text-xs font-light">
                      (System)
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="border border-slate-200 h-36 w-3/12 rounded-md p-4 flex items-end justify-center">
          <Button fullWidth onPress={handleOpenAddDebtModal}>
            Add Debt
          </Button>
        </div>
      </div>
      <div className="w-full  flex flex-col  border border-slate-200 rounded-md">
        <div className="w-full flex p-4 bg-white justify-between border-b border-slate-200">
          <div>
            <h4 className="text-gray-600 text-base font-bold">Debts</h4>
            <p className="text-gray-500 text-sm font-light">
              Show all your debts and their details here.
            </p>
          </div>
          <Button
            variant="bordered"
            color="secondary"
            startContent={<DownloadIcon width={20} height={20} />}
          >
            Download
          </Button>
        </div>

        <DebtsTable />
      </div>
    </div>
  );
}
