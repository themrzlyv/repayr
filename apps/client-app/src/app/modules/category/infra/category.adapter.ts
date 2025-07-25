import { BaseAdapter } from "@/app/lib/base-adapter";
import type { CategoryEntity } from "../domain/entities/category.entity";
import type { CreateCategoryFormSchemaType } from "../interface/schema/create-category-form.schema";
import type { UpdateCategoryFormSchemaType } from "../interface/schema/update-category-form.schema";
import type { CategoryListQueryInput } from "./types/category-list-query.input";
import type { CategoryDetailsResponseType } from "./types/category.response";
import { categoryDetailsMapper } from "./mappers/category.mapper";

export class CategoryAdapter extends BaseAdapter {
  private static instance: CategoryAdapter;

  public static getInstance(): CategoryAdapter {
    if (!CategoryAdapter.instance) {
      CategoryAdapter.instance = new CategoryAdapter();
    }
    return CategoryAdapter.instance;
  }

  public async getCategories(
    params: CategoryListQueryInput
  ): Promise<{ categories: CategoryEntity[] }> {
    const { data } = await this.httpClient.get<{
      categories: CategoryDetailsResponseType[];
    }>("/category", {
      params: { ...params },
    });
    return {
      categories: data.categories.map(cat => categoryDetailsMapper(cat)) || [],
    };
  }

  public async getCategoriesSummary(): Promise<any> {
    const { data } = await this.httpClient.get<{
      categories: CategoryDetailsResponseType[];
    }>("/category/summary");
    return data;
  }

  public async getCategoryDetails(
    id: string
  ): Promise<{ category: CategoryEntity }> {
    const { data } = await this.httpClient.get<{
      category: CategoryEntity;
    }>(`/category/${id}`);
    return data;
  }

  public async createCategory(
    input: CreateCategoryFormSchemaType
  ): Promise<boolean> {
    const { data } = await this.httpClient.post<boolean>(
      "/category/create",
      input
    );
    return data;
  }

  public async updateCategory(
    input: UpdateCategoryFormSchemaType
  ): Promise<boolean> {
    const { data } = await this.httpClient.put<boolean>(
      `/category/${input.id}`,
      input
    );
    return data;
  }

  public async removeCategory(id: string): Promise<void> {
    const { data } = await this.httpClient.delete<void>(`/category/${id}`);
    return data;
  }
}
