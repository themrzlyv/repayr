import type { DebtEntity } from "../../domain/entities/debt.entity";
import { formatDate } from "@/app/lib/format-date";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  TableCell,
  TableRow,
} from "@heroui/react";
import { EllipsisIcon } from "lucide-react";
import { useDrawerStore } from "@/app/shared/components/drawer/use-drawer.store";
import { AddOrUpdateDebt } from "../add-or-update-debt/add-or-update-debt";
import { useCallback, useMemo, useState, type Key } from "react";
import { useMutation } from "@tanstack/react-query";
import { removeDebtMutationOption } from "../../infra/mutation-options/remove-debt.mutation-option";
import { Currency, type CurrencyEnum } from "../../domain/enums/currency.enum";
import { exchangeValueMutationOption } from "@/app/modules/exchange/infra/mutation-options/exchange-value.mutation-option";
import type { ExchangeValue } from "@/app/modules/exchange/domain/value-objects/exchange-value.value-object";
import { useModalStore } from "@/app/shared/components/modal/use-modal.store";
import { PayDebt } from "../pay-debt/pay-debt";
import { DebtStatus } from "../../domain/enums/debt-status.enum";
import { DebtDetails } from "../debt-details/debt-details";

type Props = {
  debtListLoading: boolean;
  data: DebtEntity[];
};

export function useDebtsTableColumns({ debtListLoading, data }: Props) {
  const { openDrawer } = useDrawerStore();

  const { openModal } = useModalStore();

  const [exchangedDebt, setExchangedDebt] = useState<
    Record<string, ExchangeValue>
  >({});

  const { mutateAsync: removeDebtMutation } = useMutation(
    removeDebtMutationOption()
  );

  const { mutateAsync: exchangeValueMutation } = useMutation(
    exchangeValueMutationOption()
  );

  const handleAction = (action: Key, debt: DebtEntity) => {
    const debtId = debt.id;
    if (action === "view") {
      return openModal({
        title: "Debt Details",
        content: <DebtDetails debtId={debt.id} />,
        size: "xl",
      });
    }

    if (action === "pay") {
      return openModal({
        title: "Payment",
        content: <PayDebt debt={debt} />,
      });
    }

    if (action === "edit") {
      return openDrawer({
        title: "Edit Debt",
        content: <AddOrUpdateDebt debtId={debtId} />,
      });
    }

    if (action === "delete") {
      return removeDebtMutation(debtId);
    }
  };

  const debtsTableColumns = [
    { name: "Name", uid: "name", sortable: true },
    { name: "Amount", uid: "amount", sortable: false },
    { name: "Paid", uid: "totalPayments", sortable: false },
    { name: "Category", uid: "category.title" },
    { name: "Status", uid: "status", sortable: false },
    { name: "Pay Date", uid: "payDate", sortable: false },
    { name: "Actions", uid: "actions" },
  ];

  const enrichedDebtList = useMemo(() => {
    return data.map(debt => ({
      ...debt,
      exchanged: exchangedDebt[debt.id],
    }));
  }, [data, exchangedDebt]);

  const handleChangeCurrency = (
    debt: DebtEntity,
    targetCurrency: CurrencyEnum
  ) => {
    exchangeValueMutation({
      to: targetCurrency,
      from: debt.amount.currency,
      value: debt.amount.value,
    }).then(data => {
      setExchangedDebt(prev => ({
        ...prev,
        [debt.id]: data,
      }));
    });
  };

  const renderCell = useCallback(
    (debt: (typeof enrichedDebtList)[number], columnKey: React.Key) => {
      const path = (columnKey as string).split(".");
      const cellValue = path.reduce((acc, key) => {
        return acc?.[key];
      }, debt as any);

      const isPaid = debt.status === DebtStatus.PAID;

      switch (columnKey) {
        case "name":
          if (debt.lending) {
            return [
              debt.lending.user.firstName,
              debt.lending.user.lastName,
            ].join(" ");
          }

          return debt.name;
        case "amount":
          if (isPaid) {
            return (
              <div className="flex items-center gap-1">
                <span className={"line-through"}>{debt.amount.value}</span>
                <span className={"line-through"}>{debt.amount.currency}</span>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-1">
              <span>{debt.exchanged?.value ?? debt.amount.value}</span>
              <select
                disabled={isPaid}
                className="outline-none border-0 bg-transparent  text-small"
                id="amount.currency"
                value={debt.exchanged?.currency ?? debt.amount?.currency}
                onChange={e =>
                  handleChangeCurrency(debt, e.target.value as CurrencyEnum)
                }
              >
                {Object.keys(Currency).map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          );

        case "totalPayments":
          return (
            <div className="flex items-center gap-1">
              <span>{debt.exchanged?.value ?? debt.totalPayments?.value}</span>
              <select
                className="outline-none border-0 bg-transparent  text-small"
                id="amount.currency"
                value={debt.exchanged?.currency ?? debt.totalPayments?.currency}
                onChange={e =>
                  handleChangeCurrency(debt, e.target.value as CurrencyEnum)
                }
              >
                {Object.keys(Currency).map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          );

        case "payDate":
          return formatDate(debt.payDate);
        case "status":
          return (
            <Chip
              className="capitalize"
              color={debt.status === "PENDING" ? "danger" : "success"}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <EllipsisIcon className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disabledKeys={isPaid ? ["edit", "pay"] : undefined}
                  onAction={action => handleAction(action, debt)}
                >
                  <DropdownItem key="pay">Pay</DropdownItem>
                  <DropdownItem key="view">View</DropdownItem>
                  <DropdownItem key="edit">Edit</DropdownItem>
                  <DropdownItem key="delete">Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [exchangedDebt]
  );

  const tableItems = useMemo(() => {
    if (debtListLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 7 }).map((_, subIndex) => {
            return (
              <TableCell key={subIndex}>
                <Skeleton className="w-full h-8" />
              </TableCell>
            );
          })}
        </TableRow>
      ));
    }

    return (item: (typeof enrichedDebtList)[number]) => (
      <TableRow key={item.id}>
        {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
      </TableRow>
    );
  }, [debtListLoading, enrichedDebtList, exchangedDebt, renderCell]);

  return { debtsTableColumns, tableItems, debtList: enrichedDebtList };
}
