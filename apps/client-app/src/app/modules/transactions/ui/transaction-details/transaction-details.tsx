import { useQuery } from "@tanstack/react-query";
import { Chip, Divider, Skeleton } from "@heroui/react";
import { formatDate } from "@/app/lib/format-date";
import { PaymentsTable } from "./payments-table";
import { transactionDetailsQueryOption } from "../../infra/query-options/transaction-details.query-option";
import { useMemo } from "react";
import { typeFieldMap } from "../../interface/data/constants";
import { TransactionType } from "../../domain/enums/transaction-type.enum";

type Props = {
  transactionId: string;
};

export function TransactionDetails({ transactionId }: Props) {
  const { data, isLoading: transactionDetailsLoading } = useQuery(
    transactionDetailsQueryOption(transactionId)
  );

  const transactionType = useMemo(() => {
    if (!data?.type) return null;
    return typeFieldMap[data.type];
  }, [data?.type, transactionDetailsLoading]);

  const amount = [data?.amount.value, data?.amount.currency].join(" ");
  const totalPaid = [
    data?.totalPayments?.value,
    data?.totalPayments?.currency,
  ].join(" ");

  const counterPartyData = useMemo(() => {
    if (!transactionType) return null;

    const fullName = [
      data?.[transactionType]?.counterparty.firstName,
      data?.[transactionType]?.counterparty.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    const tagName = data?.[transactionType]?.counterparty.tagName;
    const email = data?.[transactionType]?.counterparty.email;

    return {
      fullName,
      tagName,
      email,
    };
  }, [transactionType, data]);

  const payments = useMemo(() => {
    if (!data || data.type === TransactionType.LENDING || !data.debt) return null;

    if (data.debt.payments.length === 0) return null;

    return data.debt.payments;
  }, [transactionType, data]);

  const isLoading = transactionDetailsLoading || !data;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-light text-gray-500 font-poppins">Status</p>
        {isLoading ? (
          <Skeleton className="w-24 h-6 rounded-lg" />
        ) : (
          <Chip
            variant="dot"
            color="success"
            classNames={{
              content: ["px-0", "pl-2"],
              base: ["px-0", "border-none", "h-max"],
            }}
          >
            <span className="capitalize text-sm font-poppins font-medium">
              {data?.status.toLowerCase()}
            </span>
          </Chip>
        )}
      </div>
      <Divider className="my-4" />
      <p className="text-lg font-medium mb-2">Overview</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-light font-poppins text-gray-500">Name</p>
          {isLoading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-sm text-right font-poppins font-normal">
              {data.name ?? counterPartyData?.fullName}
            </p>
          )}
        </div>

        {data?.lending && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-light font-poppins text-gray-500">
              Tag name
            </p>
            {isLoading ? (
              <Skeleton className="w-24 h-6" />
            ) : (
              <p className="text-sm text-right font-poppins font-normal">
                {counterPartyData?.tagName}
              </p>
            )}
          </div>
        )}

        {data?.lending && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-light font-poppins text-gray-500">
              Lender email
            </p>
            {isLoading ? (
              <Skeleton className="w-24 h-6" />
            ) : (
              <p className="text-sm text-right font-poppins font-normal">
                {counterPartyData?.email}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs font-light font-poppins text-gray-500">
            Category
          </p>
          {isLoading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-sm text-right font-poppins font-normal">
              {data.category?.title}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-light font-poppins text-gray-500">
            Description
          </p>
          {isLoading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-sm text-right italic font-poppins font-extralight">
              {data.description}
            </p>
          )}
        </div>

        <Divider className="my-4" />
        <p className="text-lg font-medium mb-2">Details</p>

        <div className="flex items-center justify-between">
          <p className="text-xs font-light font-poppins text-gray-500">
            Amount
          </p>
          {isLoading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-sm text-right font-poppins font-normal">
              {amount}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-light font-poppins text-gray-500">
            Total Paid
          </p>
          {isLoading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-sm text-right font-poppins font-normal">
              {totalPaid}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-light font-poppins text-gray-500">
            Deadline
          </p>
          {!data?.dueDate ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-sm text-right font-poppins font-normal">
              {formatDate(data.dueDate)}
            </p>
          )}
        </div>
      </div>

      {payments ? (
        <>
          <Divider className="my-4" />
          <p className="text-lg font-medium mb-2">Payments</p>
          <PaymentsTable payments={payments} />
        </>
      ) : null}
    </div>
  );
}
