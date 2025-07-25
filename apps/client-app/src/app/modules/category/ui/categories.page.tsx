import { Button, Checkbox } from "@heroui/react";
import * as Icons from "react-icons/ai";
import { AddOrUpdateCategory } from "./add-or-update-category/add-or-update-category";
import type { CategoryEntity } from "../domain/entities/category.entity";
import { categoriesQueryOption } from "../infra/query-options/categories.query-option";
import { useQuery } from "@tanstack/react-query";
import { useDrawerStore } from "@/app/shared/components/drawer/use-drawer.store";

export function CategoriesPage() {
  const { openDrawer } = useDrawerStore();

  const { data } = useQuery(categoriesQueryOption({ filter: "CUSTOM" }));

  const handleOpenAddCategoryModal = () => {
    openDrawer({
      title: "Add Category",
      content: <AddOrUpdateCategory />,
    });
  };

  const handleOpenDetails = (category: CategoryEntity) => {
    openDrawer({
      title: "Update Category",
      content: <AddOrUpdateCategory category={category} />,
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
          {data?.categories.map(category => {
            const Icon = Icons[category.icon as keyof typeof Icons];
            return (
              <div
                key={category.id}
                onClick={() => handleOpenDetails(category)}
                className="flex items-center cursor-pointer w-max gap-8 p-2 border border-slate-200 rounded-md"
              >
                <div className="flex items-center gap-2">
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
