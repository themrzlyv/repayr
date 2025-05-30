import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@repo/ui";
import { Select, SelectItem, DatePicker } from "@heroui/react";
import clsx from "clsx";
import * as Icons from "react-icons/ai";
import { useAppDispatch } from "@src/lib/store";
import { useGetCategoriesQuery } from "@src/modules/category/infra/category.api";
import { useMemo } from "react";
import { CategoryEntity } from "@src/modules/category/domain/entities/category.entity";
import { getLocalTimeZone, parseDate } from "@internationalized/date";

import { DebtEntity } from "../../domain/entities/debt.entity";
import {
  createDebtFormSchema,
  CreateDebtFormType,
} from "../../interface/data/form-schema";

type Props = {
  debt?: DebtEntity;
};

export function AddOrUpdateDebt({ debt }: Props) {
  const dispatch = useAppDispatch();

  const { data } = useGetCategoriesQuery({ select: "all" });

  const categoriesHash = useMemo(() => {
    if (!data || !data?.categories) return null;

    return data.categories.reduce(
      (acc, item) => {
        acc[item.id] = item;
        return acc;
      },
      {} as Record<string, CategoryEntity>,
    );
  }, [data]);

  //   const [createCategoryMutation, { isLoading: createCategoryLoading }] =
  //     useCreateCategoryMutation();

  //   const [updateCategoryMutation, { isLoading: updateCategoryLoading }] =
  //     useUpdateCategoryMutation();

  //   const [removeCategoryMutation, { isLoading: removeCategoryLoading }] =
  //     useRemoveCategoryMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    getValues,
  } = useForm<CreateDebtFormType>({
    resolver: zodResolver(createDebtFormSchema),
    ...(debt && {
      values: {
        name: debt.name,
        description: debt.description,
        amount: debt.amount,
        category: debt.category,
        payDate: debt.payDate,
      },
    }),
  });

  console.log(errors, "errors");

  const onSubmit = (values: CreateDebtFormType) => {
    console.log(values, "valuuuus");
    // if (category?.id) {
    //   updateCategoryMutation({ ...values, id: category.id }).then(() =>
    //     dispatch(closeModal())
    //   );
    // } else {
    //   createCategoryMutation(values).then(() => dispatch(closeModal()));
    // }
  };

  const handleRemove = () => {
    // if (!category) return;
    // removeCategoryMutation(category.id).then(() => {
    //   dispatch(closeModal());
    // });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <div className="flex flex-col gap-4">
          <Input
            {...register("name")}
            label="Name"
            type="text"
            errorMessage={errors?.name?.message}
          />
          <Input
            {...register("description")}
            label="Description"
            type="text"
            errorMessage={errors?.description?.message}
          />
          <Input
            {...register("amount", {
              valueAsNumber: true,
            })}
            isNumberInput
            label="Amount"
            errorMessage={errors.amount?.message}
          />
          {data && (
            <Select
              label="Select an animal"
              onChange={(e) => {
                if (categoriesHash) {
                  const value = categoriesHash[
                    e.target.value
                  ] as CategoryEntity;
                  setValue("category", value);
                }
              }}
              errorMessage={errors?.category?.message}
              isInvalid={!!errors?.category}
            >
              {data.categories.map((item) => {
                const Icon = Icons[item.icon as keyof typeof Icons];
                return (
                  <SelectItem
                    key={item.id}
                    startContent={<Icon className="w-4 h-4" />}
                  >
                    {item.title}
                  </SelectItem>
                );
              })}
            </Select>
          )}
          <DatePicker
            granularity="day"
            label="Pay date"
            errorMessage={errors?.payDate?.message}
            isInvalid={!!errors?.payDate}
            onChange={(val) => {
              if (val) {
                setValue("payDate", val.toDate(getLocalTimeZone()));
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            // disabled={createCategoryLoading}
            // isLoading={createCategoryLoading || updateCategoryLoading}
            fullWidth
          >
            {debt ? "Update Debt" : "Add Debt"}
          </Button>
          {debt && (
            <Button
              type="button"
              variant="bordered"
              color="danger"
              onClick={handleRemove}
              //   disabled={removeCategoryLoading}
              //   isLoading={removeCategoryLoading}
              fullWidth
            >
              Remove Debt
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
