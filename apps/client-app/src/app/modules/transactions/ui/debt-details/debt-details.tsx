import { useQuery } from "@tanstack/react-query";
import { debtDetailsQueryOption } from "../../infra/query-options/transaction-details.query-option";
import { Chip, Divider, Skeleton } from "@heroui/react";
import { formatDate } from "@/app/lib/format-date";
import { PaymentsTable } from "./payments-table";

type Props = {
  debtId: string;
};

export function DebtDetails({ debtId }: Props) {
  const { data, isLoading: debtDetailsLoading } = useQuery(
    debtDetailsQueryOption(debtId)
  );

  const amount = [data?.amount.value, data?.amount.currency].join(" ");
  const totalPaid = [
    data?.totalPayments.value,
    data?.totalPayments.currency,
  ].join(" ");

  const isLoading = debtDetailsLoading || !data;

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
              {data.name ??
                [
                  data?.lending.user.firstName,
                  data?.lending.user.lastName,
                ].join(" ")}
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
                {data.lending.user.tagName}
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
                {data.lending.user.email}
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
          {isLoading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <p className="text-sm text-right font-poppins font-normal">
              {formatDate(data.payDate)}
            </p>
          )}
        </div>
      </div>

      {!isLoading && data?.payments?.length > 0 && (
        <>
          <Divider className="my-4" />
          <p className="text-lg font-medium mb-2">Payments</p>
          {data?.payments && <PaymentsTable payments={data?.payments || []} />}
        </>
      )}
    </div>
  );
}
