"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { DataTablePagination } from "@/components/app/DataTablePagination";
import {
  EmployeeDetailDrawer,
  EmployeeRowTrigger,
} from "@/components/app/EmployeeDetailDrawer";
import * as Checkbox from "@/components/ui/checkbox";
import * as Table from "@/components/ui/table";
import { formatDate, relLabel } from "@/lib/app/helpers";
import type { Employee } from "@/payload-types";
import { cn } from "@/utils/cn";

interface EmployeesDataTableProps {
  data: Employee[];
  limit: number;
  page: number;
  pageCount: number;
  totalDocs: number;
}

export function EmployeesDataTable({
  data,
  limit,
  page,
  pageCount,
  totalDocs,
}: EmployeesDataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEmployeeId, setDrawerEmployeeId] = useState<string | null>(null);

  const openEmployeeDrawer = useCallback((employeeId: string) => {
    setDrawerEmployeeId(employeeId);
    setDrawerOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox.Root
            aria-label="Select all employees on this page"
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
            aria-label={`Select ${row.original.fullName}`}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value === true)}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "fullName",
        header: "Employee",
        cell: ({ row }) => (
          <EmployeeRowTrigger
            employee={row.original}
            onOpen={() => openEmployeeDrawer(row.original.id)}
          />
        ),
      },
      {
        accessorKey: "jobTitle",
        header: "Job title",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {row.original.jobTitle ?? "—"}
          </span>
        ),
      },
      {
        id: "team",
        header: "Team",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {relLabel(row.original.team)}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {row.original.email ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Last updated",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {formatDate(row.original.updatedAt)}
          </span>
        ),
      },
    ],
    [openEmployeeDrawer]
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
            ? "No employees found"
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
                    header.id === "updatedAt" && "w-36"
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
                No employees match your search.
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

      <EmployeeDetailDrawer
        employeeId={drawerEmployeeId}
        onOpenChange={(next) => {
          setDrawerOpen(next);
          if (!next) {
            setDrawerEmployeeId(null);
          }
        }}
        open={drawerOpen}
      />
    </div>
  );
}
