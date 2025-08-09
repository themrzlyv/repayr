import { useQuery } from "@tanstack/react-query";
import { transactionListQueryOption } from "../../infra/query-options/transaction-list.query-option";
import type { TransactionTypeEnum } from "../../domain/enums/transaction-type.enum";
import {
  Pagination,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
} from "@heroui/react";
import { useState } from "react";
import { useDebounce } from "@/app/shared/hooks/use-debounce";
import { TransactionsTableHeader } from "./transactions-table-header";
import { useTransactionsTable } from "./use-transactions-table";

type Props = {
  type: TransactionTypeEnum;
};

export function TransactionsTable({ type }: Props) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const { data: transactionData, isFetching: transactionListLoading } =
    useQuery(
      transactionListQueryOption({
        page,
        type,
        searchQuery: debouncedSearchQuery,
      })
    );

  const { tableColumns, tableItems, transactionList } = useTransactionsTable({
    dataLoading: transactionListLoading,
    data: transactionData?.transactions || [],
    type,
  });
  return (
    <Table
      aria-label="debts-table"
      selectionBehavior="toggle"
      selectionMode="multiple"
      onRowAction={key => console.log(key, "row action id")}
      // sortDescriptor={sortDescriptor}
      // onSortChange={setSortDescriptor}
      radius="none"
      shadow="none"
      classNames={{
        loadingWrapper: "mx-4 flex-col pt-20 gap-1",
        wrapper: "flex-1 justify-start",
        base: "flex-1 ",
      }}
      topContent={
        <TransactionsTableHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      }
      bottomContent={
        transactionData?.pagination.totalPages && (
          <div className="w-full flex justify-end">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              isDisabled={transactionListLoading}
              total={transactionData?.pagination.totalPages}
              onChange={page => setPage(page)}
            />
          </div>
        )
      }
    >
      <TableHeader columns={tableColumns} className="rounded-none">
        {column => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"No transaction found"}
        items={transactionList || []}
      >
        {tableItems}
      </TableBody>
    </Table>
  );
}
