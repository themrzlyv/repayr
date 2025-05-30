"use client";
import { Button, Checkbox } from "@repo/ui";
import { CategoryEntity } from "@src/modules/category/domain/entities/category.entity";
import { useGetCategoriesQuery } from "@src/modules/category/infra/category.api";
import { AddOrUpdateCategory } from "@src/modules/category/ui/add-or-update-category/add-or-update-category";
import { useModal } from "@src/modules/root-app/interface/providers/modal-provider";
import * as Icons from "react-icons/ai";

export function AdminPage() {
  const { openModal } = useModal();

  const { data } = useGetCategoriesQuery({ select: "all" });

  const handleOpenAddCategoryModal = () => {
    openModal({
      title: "Add Category",
      content: <AddOrUpdateCategory />,
      actions: null,
    });
  };

  const handleOpenDetails = (category: CategoryEntity) => {
    openModal({
      title: "Update Category",
      content: <AddOrUpdateCategory category={category} />,
      actions: null,
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-6 border border-slate-200 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-lg text-gray-700 font-medium">
            Manage Categories
          </h4>
          <Button variant="bordered" onPress={handleOpenAddCategoryModal}>
            Add Category
          </Button>
        </div>
        <div className="flex gap-4">
          {data?.categories.map((category) => {
            const Icon = Icons[category.icon as keyof typeof Icons];
            return (
              <div
                key={category.id}
                className="flex items-center w-max gap-8 p-2 border border-slate-200 rounded-md"
              >
                <div
                  className="flex items-center gap-2"
                  onClick={() => handleOpenDetails(category)}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <p className="text-base text-gray-700 font-medium">
                    {category.title}
                  </p>
                </div>
                <Checkbox />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
