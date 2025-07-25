import { BaseAdapter } from "@/app/lib/base-adapter";
import type { CreateDebtInputType } from "./types/create-lending.input";
import type { UpdateDebtInputType } from "./types/update-lending.input";
import type { LendingListResponseType } from "./types/lending-list.response";
import { DEFAULT_TABLE_PER_PAGE } from "@/app/lib/constants";
import type {  LendingListInputType } from "./types/lending-list.input";
import type { LendingDetailsResponseType } from "./types/lending-details.response";
import { lendingDetailsMapper } from "./mappers/lending-details.mapper";

export class LendingAdapter extends BaseAdapter {
  private static instance: LendingAdapter;

  public static getInstance(): LendingAdapter {
    if (!LendingAdapter.instance) {
      LendingAdapter.instance = new LendingAdapter();
    }
    return LendingAdapter.instance;
  }

  public async getLendingList({
    page,
    perPage,
    sort,
    searchQuery,
  }: LendingListInputType) {
    const params = new URLSearchParams();

    params.set("page", page.toString());
    params.set("perPage", (perPage || DEFAULT_TABLE_PER_PAGE).toString());

    if (sort?.sortField && sort?.sortDirection) {
      params.set("sortField", sort?.sortField.toString());
      params.set("sortDirection", sort?.sortDirection.toString());
    }

    if (searchQuery) {
      params.set("searchQuery", searchQuery);
    }

    const { data } = await this.httpClient.get<LendingListResponseType>(
      `/lending/list?${params.toString()}`
    );
    return {
      pagination: data.pagination,
      lendings: data.lendings.map(lendingDetailsMapper),
    };
  }

  public async getLendingDetails(id: string) {
    const { data } = await this.httpClient.get<{
      debt: LendingDetailsResponseType;
    }>(`/debt/${id}`);
    return lendingDetailsMapper(data.debt);
  }

  public async createLending(input: CreateDebtInputType): Promise<boolean> {
    const { data } = await this.httpClient.post<boolean>("/debt/create", input);
    return data;
  }

  public async updateLending(input: UpdateDebtInputType): Promise<boolean> {
    const { data } = await this.httpClient.put<boolean>(
      `/debt/${input.id}`,
      input
    );
    return data;
  }

  public async removeLending(id: string): Promise<void> {
    const { data } = await this.httpClient.delete<void>(`/debt/${id}`);
    return data;
  }
}
