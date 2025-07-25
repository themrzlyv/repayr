import { BaseAdapter } from "@/app/lib/base-adapter";
import type { CreateDebtInputType } from "./types/create-debt.input";
import type { DebtEntity } from "../domain/entities/debt.entity";
import type { UpdateDebtInputType } from "./types/update-debt.input";
import { debtDetailsMapper } from "./mappers/debt-details.mapper";
import type { DebtDetailsResponseType } from "./types/debt-details.response";
import type { DebtListResponseType } from "./types/debt-list.response";
import { DEFAULT_TABLE_PER_PAGE } from "@/app/lib/constants";
import type { DebtListInputType } from "./types/debt-list.input";

export class DebtsAdapter extends BaseAdapter {
  private static instance: DebtsAdapter;

  public static getInstance(): DebtsAdapter {
    if (!DebtsAdapter.instance) {
      DebtsAdapter.instance = new DebtsAdapter();
    }
    return DebtsAdapter.instance;
  }

  public async getDebtList({
    page,
    perPage,
    sort,
    searchQuery,
  }: DebtListInputType) {
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

    const { data } = await this.httpClient.get<DebtListResponseType>(
      `/debt/list?${params.toString()}`
    );
    return {
      pagination: data.pagination,
      debts: data.debts.map(debtDetailsMapper),
    };
  }

  public async getDebtDetails(id: string) {
    const { data } = await this.httpClient.get<{
      debt: DebtDetailsResponseType;
    }>(`/debt/${id}`);
    return debtDetailsMapper(data.debt);
  }

  public async createDebt(input: CreateDebtInputType): Promise<boolean> {
    const { data } = await this.httpClient.post<boolean>("/debt/create", input);
    return data;
  }

  public async updateDebt(input: UpdateDebtInputType): Promise<boolean> {
    const { data } = await this.httpClient.put<boolean>(
      `/debt/${input.id}`,
      input
    );
    return data;
  }

  public async removeDebt(id: string): Promise<void> {
    const { data } = await this.httpClient.delete<void>(`/debt/${id}`);
    return data;
  }
}
