import {
  Pagination,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  type SortDescriptor,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { debtListQueryOption } from "../../infra/query-options/debt-list.query-option";

import { useDebtsTableColumns } from "./use-debts-table.columns";
import { DebtsTableHeader } from "./debts-table-header";
import { useDebounce } from "@/app/shared/hooks/use-debounce";
import { debtListSortMapper } from "../../infra/mappers/debt-list-sort.mapper";

export function DebtsTable() {
  const [page, setPage] = useState(1);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const { data: debtData, isFetching: debtListLoading } = useQuery(
    debtListQueryOption({
      page,
      sort: debtListSortMapper(sortDescriptor),
      searchQuery: debouncedSearchQuery,
    })
  );

  const { debtsTableColumns, tableItems, debtList } = useDebtsTableColumns({
    debtListLoading,
    data: debtData?.debts || [],
  });

  return (
    <Table
      aria-label="debts-table"
      selectionBehavior="toggle"
      selectionMode="multiple"
      onRowAction={key => console.log(key, "row action id")}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      radius="none"
      shadow="none"
      classNames={{
        loadingWrapper: "mx-4 flex-col pt-20 gap-1",
        wrapper: "flex-1 justify-start",
        base: "flex-1 ",
      }}
      topContent={
        <DebtsTableHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      }
      bottomContent={
        debtData?.pagination.totalPages && (
          <div className="w-full flex justify-end">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              isDisabled={debtListLoading}
              total={debtData?.pagination.totalPages}
              onChange={page => setPage(page)}
            />
          </div>
        )
      }
    >
      <TableHeader columns={debtsTableColumns} className="rounded-none">
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
      <TableBody emptyContent={"No debts found"} items={debtList || []}>
        {tableItems}
      </TableBody>
    </Table>
  );
}
