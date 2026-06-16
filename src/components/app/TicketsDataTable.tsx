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
  TicketDetailDrawer,
  TicketRowTrigger,
} from "@/components/app/TicketDetailDrawer";
import { TicketStatusBadge } from "@/components/app/TicketStatusBadge";
import * as Checkbox from "@/components/ui/checkbox";
import * as Table from "@/components/ui/table";
import { formatDate, relLabel } from "@/lib/app/helpers";
import type { Ticket } from "@/payload-types";
import { cn } from "@/utils/cn";

interface TicketsDataTableProps {
  data: Ticket[];
  limit: number;
  page: number;
  pageCount: number;
  totalDocs: number;
}

export function TicketsDataTable({
  data,
  limit,
  page,
  pageCount,
  totalDocs,
}: TicketsDataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTicketId, setDrawerTicketId] = useState<string | null>(null);

  const openTicketDrawer = useCallback((ticketId: string) => {
    setDrawerTicketId(ticketId);
    setDrawerOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Ticket>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox.Root
            aria-label="Select all tickets on this page"
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
            aria-label={`Select ${row.original.title}`}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value === true)}
          />
        ),
        enableSorting: false,
      },
      {
        id: "ticket",
        header: "Ticket",
        cell: ({ row }) => (
          <TicketRowTrigger
            onOpen={() => openTicketDrawer(row.original.id)}
            ticket={row.original}
          />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <TicketStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600 capitalize">
            {row.original.priority}
          </span>
        ),
      },
      {
        id: "location",
        header: "Location",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {relLabel(row.original.location)}
          </span>
        ),
      },
      {
        id: "assignedTeam",
        header: "Team",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {relLabel(row.original.assignedTeam)}
          </span>
        ),
      },
      {
        id: "assignedTo",
        header: "Assignee",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {relLabel(row.original.assignedTo)}
          </span>
        ),
      },
      {
        accessorKey: "reportedAt",
        header: "Reported",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {formatDate(row.original.reportedAt)}
          </span>
        ),
      },
    ],
    [openTicketDrawer]
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
            ? "No tickets found"
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
                    header.id === "status" && "w-32",
                    header.id === "priority" && "w-24",
                    header.id === "assignedTeam" && "w-36",
                    header.id === "assignedTo" && "w-36",
                    header.id === "reportedAt" && "w-32"
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
                No tickets match your search.
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

      <TicketDetailDrawer
        onOpenChange={(next) => {
          setDrawerOpen(next);
          if (!next) {
            setDrawerTicketId(null);
          }
        }}
        open={drawerOpen}
        ticketId={drawerTicketId}
      />
    </div>
  );
}
