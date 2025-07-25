import { Skeleton } from "@heroui/react";

import { type CreateDebtFormSchemaType } from "../../interface/schema/create-debt-form.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { createDebtMutationOption } from "../../infra/mutation-options/create-debt.mutation-option";
import { updateDebtMutationOption } from "../../infra/mutation-options/update-debt.mutation-option";
import { removeDebtMutationOption } from "../../infra/mutation-options/remove-debt.mutation-option";
import { useDrawerStore } from "@/app/shared/components/drawer/use-drawer.store";
import { debtDetailsQueryOption } from "../../infra/query-options/debt-details.query-option";
import { DebtForm } from "./debt-form";

type Props = {
  debtId?: string;
};

export function AddOrUpdateDebt({ debtId }: Props) {
  const { closeDrawer } = useDrawerStore();
  const { data: debtData } = useQuery({
    ...debtDetailsQueryOption(debtId || ""),
    enabled: !!debtId,
  });

  const { mutateAsync: createDebtMutation, isPending: createDebtLoading } =
    useMutation(createDebtMutationOption({ onSuccess: () => closeDrawer() }));

  const { mutateAsync: updateDebtMutation, isPending: updateDebtLoading } =
    useMutation(updateDebtMutationOption({ onSuccess: () => closeDrawer() }));

  const { mutateAsync: removeDebtMutation, isPending: removeDebtLoading } =
    useMutation(removeDebtMutationOption({ onSuccess: () => closeDrawer() }));

  const onSubmit = async (values: CreateDebtFormSchemaType) => {
    console.log(values, "valuuuu");
    const payload = {
      description: values.description,
      amount: {
        ...values.amount,
        value: parseFloat(values.amount.value),
      },
      payDate: values.payDate,
      categoryId: values.category.id,
      ...(values.lenderId
        ? { lenderId: values.lenderId, name: undefined }
        : { name: values.name, lenderId: undefined }),
    };
    if (debtId) {
      await updateDebtMutation({ ...payload, id: debtId });
    } else {
      await createDebtMutation(payload);
    }
  };

  const formValues = useMemo(() => {
    if (!debtData || !debtId || !debtData?.category) return null;

    return {
      name: debtData?.name,
      description: debtData?.description,
      amount: {
        ...debtData?.amount,
        value: debtData?.amount.value.toString(),
      },
      category: {
        id: debtData?.category?.id,
        title: debtData?.category?.title,
        icon: debtData?.category?.icon,
      },
      payDate: debtData?.payDate,
      status: debtData?.status,
    };
  }, [debtId, debtData]);

  const handleRemove = () => {
    if (!debtId) return;
    removeDebtMutation(debtId);
  };

  if (!debtData && debtId) {
    return (
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[3.5rem] rounded-lg" />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <DebtForm
      onSubmit={onSubmit}
      formValues={formValues}
      onRemove={debtId ? handleRemove : undefined}
      submitLoading={createDebtLoading || updateDebtLoading}
      removeLoading={removeDebtLoading}
    />
  );
}
