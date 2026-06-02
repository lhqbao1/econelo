"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { GetCartLocalColumns } from "./local-columns";
import { useIsPhone } from "@/hooks/use-is-phone";
import type { CartIncomingInventoryItem } from "@/lib/utils/cart";

export type CartTableItem = {
  id?: string;
  product_id: string;
  product_name: string;
  img_url?: string;
  final_price: number;
  quantity: number;
  is_active: boolean;
  item_price: number;
  stock: number;
  id_provider?: string;
  delivery_time?: string;
  result_stock?: number;
  inventory_pos?: CartIncomingInventoryItem[];
};

interface CartLocalTableProps {
  data: CartTableItem[];
  onToggleItem: (product_id: string, is_active: boolean) => void;
  onToggleAll: (is_active: boolean) => void;
  isCheckout?: boolean;
}

export default function CartLocalTable({
  data,
  onToggleItem,
  onToggleAll,
  isCheckout = false,
}: CartLocalTableProps) {
  const isPhone = useIsPhone();
  const table = useReactTable({
    data,
    // columns: baseColumns,
    columns: GetCartLocalColumns(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="col-span-12 lg:col-span-8 flex-1">
      <Table className={isPhone ? "text-wrap" : "table-fixed text-wrap"}>
        {!isPhone && (
          <colgroup>
            <col className="w-[38%]" />
            <col className="w-[24%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
            <col className="w-[8%]" />
          </colgroup>
        )}
        {isPhone ? (
          ""
        ) : (
          <TableHeader className="border-t">
            {table
              .getHeaderGroups()
              .filter((headerGroup) =>
                headerGroup.headers.some((header) => !header.isPlaceholder)
              )
              .map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-normal px-1 md:px-2"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
          </TableHeader>
        )}
        <TableBody>
          {table.getRowModel().rows.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-normal px-1 md:px-2"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : ""}
        </TableBody>
      </Table>
    </div>
  );
}
