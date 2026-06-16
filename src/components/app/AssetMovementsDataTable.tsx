"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTablePagination } from "@/components/app/DataTablePagination";
import * as Checkbox from "@/components/ui/checkbox";
import * as Table from "@/components/ui/table";
import { formatDateTime, relLabel } from "@/lib/app/helpers";
import type { AssetMovement } from "@/payload-types";
import { cn } from "@/utils/cn";

interface AssetMovementsDataTableProps {
  data: AssetMovement[];
  limit: number;
  page: number;
  pageCount: number;
  totalDocs: number;
}

export function AssetMovementsDataTable({
  data,
  limit,
  page,
  pageCount,
  totalDocs,
}: AssetMovementsDataTableProps) {
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<AssetMovement>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox.Root
            aria-label="Select all movements on this page"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(value === true)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox.Root
            aria-label={`Select ${row.original.reference ?? row.original.id}`}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value === true)}
          />
        ),
        enableSorting: false,
      },
      {
        id: "reference",
        header: "Reference",
        cell: ({ row }) => (
          <span className="font-mono text-paragraph-sm text-text-strong-950">
            {row.original.reference ?? "—"}
          </span>
        ),
      },
      {
        id: "asset",
        header: "Asset",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {relLabel(row.original.asset)}
          </span>
        ),
      },
      {
        id: "from",
        header: "From",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {relLabel(row.original.fromLocation)}
          </span>
        ),
      },
      {
        id: "to",
        header: "To",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {relLabel(row.original.toLocation)}
          </span>
        ),
      },
      {
        accessorKey: "movedAt",
        header: "Moved at",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {formatDateTime(row.original.movedAt)}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination: { pageIndex: page - 1, pageSize: limit },
      rowSelection,
    },
  });

  const rangeStart = totalDocs === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, totalDocs);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-paragraph-sm text-text-sub-600">
          {totalDocs === 0
            ? "No movements found"
            : `Showing ${rangeStart}–${rangeEnd} of ${totalDocs}`}
          {selectedCount > 0 ? ` · ${selectedCount} selected` : null}
        </p>
      </div>

      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Head
                  className={cn(
                    header.id === "select" && "w-12",
                    header.id === "reference" && "w-32",
                    header.id === "movedAt" && "w-40"
                  )}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Table.Head>
              ))}
            </tr>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.length === 0 ? (
            <Table.Row>
              <Table.Cell
                className="py-12 text-center text-paragraph-sm text-text-sub-600"
                colSpan={columns.length}
              >
                No movements match your search.
              </Table.Cell>
            </Table.Row>
          ) : (
            table.getRowModel().rows.map((row, rowIndex) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
                {rowIndex < table.getRowModel().rows.length - 1 ? (
                  <Table.RowDivider />
                ) : null}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <DataTablePagination page={page} pageCount={pageCount} />
    </div>
  );
}
