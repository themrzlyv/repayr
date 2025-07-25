import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import type { PaymentEntity } from "../../domain/entities/payment.entity";
import { formatDate } from "@/app/lib/format-date";

type Props = {
  payments: PaymentEntity[];
};

export function PaymentsTable({ payments }: Props) {
  const paymentsTableColumns = [
    { name: "Amount", uid: "amount.value", sortable: false },
    { name: "Currency", uid: "amount.currency", sortable: false },
    { name: "Date", uid: "createdAt", sortable: false },
  ];

  return (
    <Table
      aria-label="payments-table"
      radius="none"
      shadow="none"
      classNames={{
        loadingWrapper: "mx-4 flex-col pt-20 gap-1",
        wrapper: "flex-1 justify-start p-0",
        base: "flex-1 ",
      }}
    >
      <TableHeader columns={paymentsTableColumns} className="rounded-none">
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
      <TableBody emptyContent={"No payments found"} items={payments || []}>
        {item => (
          <TableRow key={item.id}>
            <TableCell>{item.amount.value}</TableCell>
            <TableCell>{item.amount.currency}</TableCell>
            <TableCell>{formatDate(item.createdAt)}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
