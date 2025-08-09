import { BaseAdapter } from "@/app/lib/base-adapter";
import type { GetTransactionsQueryType } from "./types/get-transactions-query";
import { DEFAULT_TABLE_PER_PAGE } from "@/app/lib/constants";
import type { CreateTransactionInputType } from "./types/create-transaction.input";
import type { TransactionListResponseValueObject } from "../domain/value-objects/transaction-list-response.value-object";
import type { UpdateTransactionStatusInputType } from "./types/update-transaction-status.input";
import type { TransactionEntity } from "../domain/entities/transaction.entity";

export class TransactionsAdapter extends BaseAdapter {
  private static instance: TransactionsAdapter;

  public static getInstance(): TransactionsAdapter {
    if (!TransactionsAdapter.instance) {
      TransactionsAdapter.instance = new TransactionsAdapter();
    }
    return TransactionsAdapter.instance;
  }

  public async getTransactionList({
    page = 1,
    limit,
    order,
    sortBy,
    status,
    type,
    searchQuery,
  }: GetTransactionsQueryType) {
    const params = new URLSearchParams();

    if (type) {
      params.set("type", type.toString());
    }

    params.set("page", page.toString());
    params.set("limit", (limit || DEFAULT_TABLE_PER_PAGE).toString());

    // if (sort?.sortField && sort?.sortDirection) {
    //   params.set("sortField", sort?.sortField.toString());
    //   params.set("sortDirection", sort?.sortDirection.toString());
    // }

    if (status) {
      params.set("status", status.toString());
    }

    if (searchQuery) {
      params.set("searchQuery", searchQuery);
    }

    const { data } =
      await this.httpClient.get<TransactionListResponseValueObject>(
        `/transaction?${params.toString()}`
      );

    return {
      pagination: data.pagination,
      transactions: data.transactions,
    };
  }

  public async getTransactionDetails(id: string) {
    const { data } = await this.httpClient.get<TransactionEntity>(
      `/transaction/${id}`
    );
    return data;
  }

  public async createTransaction(
    input: CreateTransactionInputType
  ): Promise<boolean> {
    const { data } = await this.httpClient.post<boolean>(
      "/transaction/create",
      input
    );
    return data;
  }

  public async updateTransactionStatus(
    input: UpdateTransactionStatusInputType
  ): Promise<boolean> {
    const { data } = await this.httpClient.put<boolean>(
      `/transaction/update-status`,
      input
    );
    return data;
  }

  // public async removeDebt(id: string): Promise<void> {
  //   const { data } = await this.httpClient.delete<void>(`/debt/${id}`);
  //   return data;
  // }
}
