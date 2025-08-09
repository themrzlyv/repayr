import type { ExchangeValue } from "@/app/modules/exchange/domain/value-objects/exchange-value.value-object";
import { useDrawerStore } from "@/app/shared/components/drawer/use-drawer.store";
import { useModalStore } from "@/app/shared/components/modal/use-modal.store";
import {
  TransactionStatus,
  type TransactionStatusEnum,
} from "@/app/modules/transactions/domain/enums/transaction-status.enum";
import { useCallback, useMemo, useState, type Key } from "react";
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
import { Currency, type CurrencyEnum } from "../../domain/enums/currency.enum";
import { useMutation } from "@tanstack/react-query";
import { exchangeValueMutationOption } from "@/app/modules/exchange/infra/mutation-options/exchange-value.mutation-option";
import { formatDate } from "@/app/lib/format-date";
import { EllipsisIcon } from "lucide-react";
import {
  TransactionType,
  type TransactionTypeEnum,
} from "../../domain/enums/transaction-type.enum";
import type { TransactionEntity } from "../../domain/entities/transaction.entity";
import { updateTransactionStatusMutationOption } from "../../infra/mutation-options/update-transaction-status.mutation-option";
import { CreatePayment } from "@/app/modules/payment/ui/create-payment/create-payment";
import { typeFieldMap } from "../../interface/data/constants";
import { TransactionDetails } from "../transaction-details/transaction-details";

type Props = {
  dataLoading: boolean;
  data: TransactionEntity[];
  type: TransactionTypeEnum;
};

export function useTransactionsTable({ data, dataLoading, type }: Props) {
  const transactionType = typeFieldMap[type];

  const { openDrawer } = useDrawerStore();

  const { openModal } = useModalStore();

  const [exchangedTransaction, setExchangedTransaction] = useState<
    Record<string, ExchangeValue>
  >({});

  const { mutateAsync: exchangeValueMutation } = useMutation(
    exchangeValueMutationOption()
  );

  const { mutateAsync: updateStatusMutation } = useMutation(
    updateTransactionStatusMutationOption()
  );

  const handleChangeAction = useCallback(
    (action: Key, transaction: TransactionEntity) => {
      switch (action) {
        case "REJECTED":
        case "ACCEPTED":
          return updateStatusMutation({
            status: action,
            transactionId: transaction.id,
          });

        case "pay":
          return openModal({
            title: "Add Payment",
            content: <CreatePayment transaction={transaction} />,
          });

        case "view":
          return openModal({
            title: "Transaction Details",
            content: <TransactionDetails transactionId={transaction.id} />,
          });

        case "edit":
          return openDrawer({});

        case "delete":
        // return removeTransaction(id);
        default:
          return null;
      }
    },
    []
  );

  const enrichedList = useMemo(() => {
    return data.map(item => ({
      ...item,
      exchanged: exchangedTransaction[item.id],
    }));
  }, [data, exchangedTransaction]);

  const renderStatusColor = useCallback(
    (status: TransactionStatusEnum) => {
      switch (status) {
        case "ACCEPTED":
          return "success";

        case "REJECTED":
          return "danger";

        case "PENDING":
          return "warning";

        default:
          return "secondary";
      }
    },
    [enrichedList]
  );

  const renderDropdownItems = useCallback(
    (status: TransactionStatusEnum, transactionType: TransactionTypeEnum) => {
      switch (status) {
        case "PAID":
        case "REJECTED":
          return (
            <>
              <DropdownItem key="view">View</DropdownItem>
              <DropdownItem key="delete">Delete</DropdownItem>
            </>
          );

        case "PENDING":
          return (
            <>
              <DropdownItem key="ACCEPTED">Accept</DropdownItem>
              <DropdownItem key="REJECTED">Reject</DropdownItem>
            </>
          );

        default:
          return (
            <>
              {transactionType === TransactionType.DEBT && (
                <DropdownItem key="pay">Pay</DropdownItem>
              )}
              <DropdownItem key="view">View</DropdownItem>
              <DropdownItem key="edit">Edit</DropdownItem>
              <DropdownItem key="delete">Delete</DropdownItem>
            </>
          );
      }
    },
    [enrichedList]
  );

  const handleChangeCurrency = (
    transaction: any,
    targetCurrency: CurrencyEnum
  ) => {
    exchangeValueMutation({
      to: targetCurrency,
      from: transaction.amount.currency,
      value: transaction.amount.value,
    }).then(data => {
      setExchangedTransaction(prev => ({
        ...prev,
        [transaction.id]: data,
      }));
    });
  };

  const renderCell = useCallback(
    (transaction: (typeof enrichedList)[number], columnKey: React.Key) => {
      const path = (columnKey as string).split(".");
      const cellValue = path.reduce((acc, key) => {
        return acc?.[key];
      }, transaction as any);

      const isPaid = transaction.status === TransactionStatus.PAID;

      switch (columnKey) {
        case "name":
          if (transaction[transactionType]) {
            return [
              transaction[transactionType].counterparty.firstName,
              transaction[transactionType].counterparty.lastName,
            ].join(" ");
          }

          return transaction.name;
        case "amount":
          if (isPaid) {
            return (
              <div className="flex items-center gap-1">
                <span className={"line-through"}>
                  {transaction.amount.value}
                </span>
                <span className={"line-through"}>
                  {transaction.amount.currency}
                </span>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-1">
              <span>
                {transaction.exchanged?.value ?? transaction.amount.value}
              </span>
              <select
                disabled={isPaid}
                className="outline-none border-0 bg-transparent  text-small"
                id="amount.currency"
                value={
                  transaction.exchanged?.currency ??
                  transaction.amount?.currency
                }
                onChange={e =>
                  handleChangeCurrency(
                    transaction,
                    e.target.value as CurrencyEnum
                  )
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
              <span>{transaction.totalPayments?.value}</span>
              <span>{transaction.totalPayments?.currency}</span>
            </div>
          );

        case "dueDate":
          return formatDate(transaction.dueDate);
        case "status":
          return (
            <Chip
              className="capitalize"
              color={renderStatusColor(transaction.status)}
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
                  onAction={action => handleChangeAction(action, transaction)}
                >
                  {renderDropdownItems(transaction.status, transaction.type)}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [exchangedTransaction, type]
  );

  const tableColumns = [
    { name: "Name", uid: "name", sortable: true },
    { name: "Amount", uid: "amount", sortable: false },
    { name: "Paid", uid: "totalPayments", sortable: false },
    { name: "Category", uid: "category.title" },
    { name: "Status", uid: "status", sortable: false },
    { name: "Due Date", uid: "dueDate", sortable: false },
    { name: "Actions", uid: "actions" },
  ];

  const tableItems = useMemo(() => {
    if (dataLoading) {
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

    return (item: (typeof enrichedList)[number]) => (
      <TableRow key={item.id}>
        {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
      </TableRow>
    );
  }, [dataLoading, enrichedList, exchangedTransaction, renderCell]);

  return { tableColumns, tableItems, transactionList: enrichedList };
}
