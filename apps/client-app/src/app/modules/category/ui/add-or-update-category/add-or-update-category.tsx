import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Icons from "react-icons/ai";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import clsx from "clsx";

import {
  categoryFormSchema,
  type CreateCategoryFormSchemaType,
} from "../../interface/schema/create-category-form.schema";
import type { CategoryEntity } from "../../domain/entities/category.entity";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCategorMutationOption } from "../../infra/mutation-options/create-category.mutation-option";
import { updateCategorMutationOption } from "../../infra/mutation-options/update-category.mutation-option";
import { removeCategorMutationOption } from "../../infra/mutation-options/remove-category.mutation-option";
import { useDrawerStore } from "@/app/shared/components/drawer/use-drawer.store";
import { accountInfoQueryOption } from "@/app/modules/account/infra/query-options/account-info.query-option";
import { AccountRoles } from "@/app/modules/account/domain/enums/account-role.enum";

type Props = {
  category?: CategoryEntity;
};

export function AddOrUpdateCategory({ category }: Props) {
  const { closeDrawer } = useDrawerStore();

  const { data: userData, isLoading: userLoading } = useQuery(
    accountInfoQueryOption()
  );

  const {
    mutateAsync: createCategoryMutation,
    isPending: createCategoryLoading,
  } = useMutation(createCategorMutationOption());

  const {
    mutateAsync: updateCategoryMutation,
    isPending: updateCategoryLoading,
  } = useMutation(updateCategorMutationOption());

  const {
    mutateAsync: removeCategoryMutation,
    isPending: removeCategoryLoading,
  } = useMutation(removeCategorMutationOption());

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryFormSchemaType>({
    resolver: zodResolver(categoryFormSchema),
    ...(category && {
      values: {
        title: category.title,
        icon: category.icon,
        type: category.type,
      },
    }),
  });

  const iconValue = watch("icon");

  const onSubmit = (values: CreateCategoryFormSchemaType) => {
    if (!!category?.id) {
      updateCategoryMutation({ ...values, id: category.id }).then(() =>
        closeDrawer()
      );
    } else {
      createCategoryMutation(values).then(() => closeDrawer());
    }
  };

  const handleRemove = () => {
    if (!category) return;
    removeCategoryMutation(category.id).then(() => {
      closeDrawer();
    });
  };

  return (
    <>
      <form
        id="category-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full justify-between pb-2"
      >
        <div className="flex flex-col gap-4">
          <Input
            {...register("title")}
            label="Title"
            type="text"
            errorMessage={errors.title?.message}
          />

          {userData?.role === AccountRoles.ADMIN && (
            <Select
              {...register("type")}
              label="Category Type"
              selectionMode="single"
              disabled={userLoading || userData?.role !== AccountRoles.ADMIN}
            >
              <SelectItem key="SYSTEM">System</SelectItem>
              <SelectItem key="CUSTOM">Custom</SelectItem>
            </Select>
          )}

          <div className="flex items-center w-full h-60 overflow-scroll mx-auto gap-1 flex-wrap">
            {Object.entries(Icons).map(([name, Icon]) => {
              const isSelected = iconValue === name;
              return (
                <div
                  key={name}
                  className={clsx(
                    "flex items-center justify-center border  p-2",
                    isSelected ? "border-red-500" : "border-slate-200"
                  )}
                  onClick={() => setValue("icon", name)}
                >
                  <Icon size={24} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            fullWidth
            disabled={createCategoryLoading}
            isLoading={createCategoryLoading || updateCategoryLoading}
          >
            {category ? "Update Category" : "Add Category"}
          </Button>
          {category && (
            <Button
              type="button"
              variant="bordered"
              color="danger"
              onPress={handleRemove}
              disabled={removeCategoryLoading}
              isLoading={removeCategoryLoading}
              fullWidth
            >
              Remove Category
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
