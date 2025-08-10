import { Button, Input } from "@heroui/react";
import { Currency } from "../../../transactions/domain/enums/currency.enum";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createPaymentMutationOption } from "@/app/modules/payment/infra/mutation-options/create-payment.mutation-option";
import { useModalStore } from "@/app/shared/components/modal/use-modal.store";
import {
  createPaymentFormSchema,
  type CreatePaymentFormSchemaType,
} from "../../interface/schema/create-payment-form.schema";
import type { TransactionEntity } from "@/app/modules/transactions/domain/entities/transaction.entity";

type Props = {
  transaction: TransactionEntity;
};

export function CreatePayment({ transaction }: Props) {
  const { closeModal } = useModalStore();
  const { mutateAsync: createPaymentMutation, isPending } = useMutation(
    createPaymentMutationOption({ onSuccess: () => closeModal() })
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePaymentFormSchemaType>({
    resolver: zodResolver(createPaymentFormSchema),
    defaultValues: {
      amount: {
        value: "",
        currency: transaction.amount.currency,
      },
      debtId: transaction?.debt?.id || "",
      transactionId: transaction.id,
    },
  });

  const onSubmit = async (formValues: CreatePaymentFormSchemaType) => {
    await createPaymentMutation({
      ...formValues,
      amount: {
        currency: formValues.amount.currency,
        value: parseFloat(formValues.amount.value),
      },
    });
  };

  const handleSetMax = () => {
    const maxValue =
      transaction.amount.value - (transaction?.totalPayments?.value || 0);
    setValue("amount.value", parseFloat(maxValue.toFixed(2)).toString());
    setValue("amount.currency", transaction.amount.currency);
  };

  return (
    <form
      id="pay-debt-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 h-full"
    >
      <div className="flex flex-col gap-2 items-end">
        <Input
          {...register("amount.value")}
          value={watch("amount.value") ?? ""}
          onChange={e => {
            const raw = e.target.value;

            const validCharacters = /^(\d+)?(\.\d{0,2})?$/;

            if (raw === "" || validCharacters.test(raw)) {
              setValue("amount.value", raw, { shouldValidate: true });
            }
          }}
          label="Amount"
          errorMessage={errors.amount?.message}
          endContent={
            <div className="flex items-center">
              <label className="sr-only" htmlFor="amount.currency">
                Currency
              </label>
              <select
                {...register("amount.currency")}
                className="outline-none border-0 bg-transparent text-default-400 text-small"
                id="amount.currency"
              >
                {Object.keys(Currency).map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          }
        />
        <button
          type="button"
          onClick={handleSetMax}
          className="text-blue-700 mr-1 text-sm w-max"
        >
          Max
        </button>
      </div>

      <Button
        type="submit"
        color="success"
        className="mb-3"
        disabled={isPending}
        isLoading={isPending}
        fullWidth
      >
        Pay
      </Button>
    </form>
  );
}
