import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/react";
import { useDrawerStore } from "@/app/shared/components/drawer/use-drawer.store";
import { categoriesQueryOption } from "../../category/infra/query-options/categories.query-option";
import { categoriesSummaryQueryOption } from "../../category/infra/query-options/categories-summary.query-option";
import * as Icons from "react-icons/ai";
import { DownloadIcon } from "@/app/assets/icons";
import { TransactionsTable } from "../../transactions/ui/transactions-table/transactions-table";
import { TransactionType } from "../../transactions/domain/enums/transaction-type.enum";
import { AddTransaction } from "../../transactions/ui/add-transaction/add-transaction";

export function LendingsPage() {
  const { openDrawer } = useDrawerStore();

  const { data } = useQuery(categoriesQueryOption({ filter: "USED" }));

  const { data: categoriesTotal } = useQuery(categoriesSummaryQueryOption());

  const handleOpenAddDebtModal = () => {
    openDrawer({
      title: "Add Debt",
      content: <AddTransaction transactionType={TransactionType.LENDING} />,
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
            Add Lending
          </Button>
        </div>
      </div>
      <div className="w-full  flex flex-col  border border-slate-200 rounded-md">
        <div className="w-full flex p-4 bg-white justify-between border-b border-slate-200">
          <div>
            <h4 className="text-gray-600 text-base font-bold">Lendings</h4>
            <p className="text-gray-500 text-sm font-light">
              Show all your lendings and their details here.
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

        <TransactionsTable type={TransactionType.LENDING} />
      </div>
    </div>
  );
}
