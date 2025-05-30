import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Icons from "react-icons/ai";
import { Button, Input } from "@repo/ui";
import clsx from "clsx";
import { useModal } from "@src/modules/root-app/interface/providers/modal-provider";

import {
  useCreateCategoryMutation,
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
} from "../../infra/category.api";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { categoryFormSchema } from "../../interface/data/form-schema";
import { CategoryFormType } from "../../infra/types/category-form-type";

type Props = {
  category?: CategoryEntity;
};

export function AddOrUpdateCategory({ category }: Props) {
  const { closeModal } = useModal();

  const [createCategoryMutation, { isLoading: createCategoryLoading }] =
    useCreateCategoryMutation();

  const [updateCategoryMutation, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();

  const [removeCategoryMutation, { isLoading: removeCategoryLoading }] =
    useRemoveCategoryMutation();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormType>({
    resolver: zodResolver(categoryFormSchema),
    ...(category && {
      values: {
        title: category.title,
        icon: category.icon,
      },
    }),
  });

  const iconValue = watch("icon");

  const onSubmit = (values: CategoryFormType) => {
    if (category?.id) {
      updateCategoryMutation({ ...values, id: category.id }).then(() =>
        closeModal(),
      );
    } else {
      createCategoryMutation(values).then(() => closeModal());
    }
  };

  const handleRemove = () => {
    if (!category) return;
    removeCategoryMutation(category.id).then(() => {
      closeModal();
    });
  };

  return (
    <>
      <form
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
          <div className="flex items-center w-full h-60 overflow-scroll mx-auto gap-1 flex-wrap">
            {Object.entries(Icons).map(([name, Icon]) => {
              const isSelected = iconValue === name;
              return (
                <div
                  key={name}
                  className={clsx(
                    "flex items-center justify-center border  p-2",
                    isSelected ? "border-red-500" : "border-slate-200",
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
