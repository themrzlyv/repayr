import { Skeleton } from "@heroui/react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDrawerStore } from "@/app/shared/components/drawer/use-drawer.store";
import { TransactionForm } from "./transaction-form";
import type { TransactionTypeEnum } from "../../domain/enums/transaction-type.enum";
import { createTransactionMutationOption } from "../../infra/mutation-options/create-transaction.mutation-option";
import type { CreateTransactionFormSchemaType } from "../../interface/schema/create-transaction-form.schema";

type Props = {
  transactionType: TransactionTypeEnum;
};

export function AddTransaction({ transactionType }: Props) {
  const { closeDrawer } = useDrawerStore();

  // const { data: debtData } = useQuery({
  //   ...debtDetailsQueryOption(debtId || ""),
  //   enabled: !!debtId,
  // });

  const { mutateAsync: createTransactionMutation, isPending: createTransactionLoading } =
    useMutation(createTransactionMutationOption({ onSuccess: () => closeDrawer() }));

  // const { mutateAsync: updateDebtMutation, isPending: updateDebtLoading } =
  //   useMutation(updateDebtMutationOption({ onSuccess: () => closeDrawer() }));

  // const { mutateAsync: removeDebtMutation, isPending: removeDebtLoading } =
  //   useMutation(removeDebtMutationOption({ onSuccess: () => closeDrawer() }));

  const onSubmit = async (values: CreateTransactionFormSchemaType) => {
    const payload = {
      description: values.description,
      amount: {
        ...values.amount,
        value: parseFloat(values.amount.value),
      },
      type: transactionType,
      dueDate: values.dueDate,
      categoryId: values.categoryId,
      ...(values.counterpartyId
        ? { counterpartyId: values.counterpartyId, name: undefined }
        : { name: values.name, counterpartyId: undefined }),
    };

    createTransactionMutation(payload);
  };

  // const formValues = useMemo(() => {
  //   if (!debtData || !debtId || !debtData?.category) return null;

  //   return {
  //     name: debtData?.name,
  //     description: debtData?.description,
  //     amount: {
  //       ...debtData?.amount,
  //       value: debtData?.amount.value.toString(),
  //     },
  //     category: {
  //       id: debtData?.category?.id,
  //       title: debtData?.category?.title,
  //       icon: debtData?.category?.icon,
  //     },
  //     payDate: debtData?.payDate,
  //     status: debtData?.status,
  //   };
  // }, [debtId, debtData]);

  // const handleRemove = () => {
  //   if (!debtId) return;
  //   removeDebtMutation(debtId);
  // };

  // if (!debtData && debtId) {
  //   return (
  //     <div className="h-full flex flex-col justify-between">
  //       <div className="flex flex-col gap-4">
  //         {Array.from({ length: 5 }).map((_, index) => (
  //           <Skeleton key={index} className="w-full h-[3.5rem] rounded-lg" />
  //         ))}
  //       </div>
  //       <div className="flex flex-col gap-2">
  //         <Skeleton className="w-full h-10 rounded-lg" />
  //         <Skeleton className="w-full h-10 rounded-lg" />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <TransactionForm
      onSubmit={onSubmit}
      formValues={null}
      onRemove={undefined}
      submitLoading={createTransactionLoading}
      removeLoading={false}
    />
  );
}
