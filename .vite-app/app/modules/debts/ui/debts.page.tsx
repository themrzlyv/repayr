"use client";

import { Button, DownloadIcon, FilterIcon, Input, SearchIcon } from "@repo/ui";
import * as Icons from "react-icons/ai";
import { useGetCategoriesQuery } from "@src/modules/category/infra/category.api";
import { useModal } from "@src/modules/root-app/interface/providers/modal-provider";

import { AddOrUpdateDebt } from "./add-or-update-debt/add-or-update-debt";

export function DebtsPage() {
  const { openModal } = useModal();
  const { data } = useGetCategoriesQuery({ select: "used" });

  const handleOpenAddDebtModal = () => {
    openModal({
      title: "Add Debt",
      content: <AddOrUpdateDebt />,
      actions: null,
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full flex items-center gap-4">
        {data?.categories.map((category, index) => {
          const Icon = Icons[category.icon as keyof typeof Icons];
          return (
            <div
              key={index}
              className="border border-slate-200 h-36 flex-1 rounded-md p-4 flex flex-col justify-between"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full shadow-sm overflow-hidden">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-black text-lg font-bold">$2.345,14</h4>
                <p className="text-gray-500 text-sm font-light">
                  {category.title}
                </p>
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
      <div className="w-full h-full border border-slate-200 rounded-md">
        <div className="w-full flex p-4 justify-between border-b border-slate-200">
          <div>
            <h4 className="text-gray-600 text-base font-bold">Debts</h4>
            <p className="text-gray-500 text-sm font-light">
              Show all your debts and their details here.
            </p>
          </div>
          <Button
            variant="bordered"
            color="neutral"
            startContent={<DownloadIcon width={20} height={20} />}
          >
            Download
          </Button>
        </div>
        <div className="w-full flex p-4 justify-between border-b border-slate-200">
          <div>
            <div className="flex items-center border border-slate-200 rounded-lg cursor-pointer">
              <div className="border-r border-slate-200 flex-1 py-2 px-4 flex items-center justify-center bg-slate-50">
                <p className="text-gray-700 text-sm font-bold">All</p>
              </div>
              <div className="border-r border-slate-200 flex-1 py-2 px-4 flex items-center justify-center">
                <p className="text-gray-700 text-sm font-bold">Month</p>
              </div>
              <div className="border-r border-slate-200 flex-1 py-2 px-4 flex items-center justify-center">
                <p className="text-gray-700 text-sm font-bold">Today</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search"
              endContent={<SearchIcon width={18} height={18} />}
            />
            <div>
              <Button
                variant="bordered"
                color="neutral"
                startContent={<FilterIcon width={20} height={20} />}
              >
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
