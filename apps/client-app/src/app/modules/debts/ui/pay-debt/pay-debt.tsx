import { Button, Input } from "@heroui/react";
import { Currency } from "../../domain/enums/currency.enum";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  payDebtFormSchema,
  type PayDebtFormSchemaType,
} from "../../interface/schema/pay-debt-form.schema";
import type { DebtEntity } from "../../domain/entities/debt.entity";
import { useMutation } from "@tanstack/react-query";
import { createPaymentMutationOption } from "@/app/modules/payment/infra/mutation-options/create-payment.mutation-option";
import { useModalStore } from "@/app/shared/components/modal/use-modal.store";

type Props = {
  debt: DebtEntity;
};

export function PayDebt({ debt }: Props) {
  const { closeModal } = useModalStore();
  const {
    mutateAsync: createPaymentMutation,
    isPending,
    error,
  } = useMutation(createPaymentMutationOption());

  console.log(error, "error");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PayDebtFormSchemaType>({
    resolver: zodResolver(payDebtFormSchema),
    defaultValues: {
      amount: {
        value: "",
        currency: debt.amount.currency,
      },
    },
  });

  const onSubmit = async (formValues: PayDebtFormSchemaType) => {
    await createPaymentMutation({
      amount: {
        currency: formValues.amount.currency,
        value: parseFloat(formValues.amount.value),
      },
      debt_id: debt.id,
    }).then(() => closeModal());
  };

  const handleSetMax = () => {
    const maxValue = debt.amount.value - debt.totalPayments.value;
    setValue("amount.value", String(maxValue));
    setValue("amount.currency", debt.amount.currency);
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
