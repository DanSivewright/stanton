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
  MaintenanceTeamDetailDrawer,
  TeamRowTrigger,
} from "@/components/app/MaintenanceTeamDetailDrawer";
import * as Checkbox from "@/components/ui/checkbox";
import * as Table from "@/components/ui/table";
import { formatDate } from "@/lib/app/helpers";
import type { TeamTicketCounts } from "@/lib/app/queries";
import type { MaintenanceTeam, TicketType } from "@/payload-types";
import { cn } from "@/utils/cn";

interface MaintenanceTeamsDataTableProps {
  data: MaintenanceTeam[];
  limit: number;
  page: number;
  pageCount: number;
  ticketCountsByTeam: TeamTicketCounts;
  ticketTypes: TicketType[];
  totalDocs: number;
}

export function MaintenanceTeamsDataTable({
  data,
  limit,
  page,
  pageCount,
  ticketCountsByTeam,
  ticketTypes,
  totalDocs,
}: MaintenanceTeamsDataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTeamId, setDrawerTeamId] = useState<string | null>(null);

  const openTeamDrawer = useCallback((teamId: string) => {
    setDrawerTeamId(teamId);
    setDrawerOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<MaintenanceTeam>[]>(() => {
    const ticketTypeColumns: ColumnDef<MaintenanceTeam>[] = ticketTypes.map(
      (ticketType) => ({
        id: `tickets-${ticketType.id}`,
        header: ticketType.name,
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {ticketCountsByTeam[row.original.id]?.[ticketType.id] ?? 0}
          </span>
        ),
      })
    );

    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox.Root
            aria-label="Select all teams on this page"
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
            aria-label={`Select ${row.original.name}`}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value === true)}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: "Team",
        cell: ({ row }) => (
          <TeamRowTrigger
            onOpen={() => openTeamDrawer(row.original.id)}
            team={row.original}
          />
        ),
      },
      {
        id: "members",
        header: "Members",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {row.original.members?.length ?? 0}
          </span>
        ),
      },
      ...ticketTypeColumns,
      {
        accessorKey: "updatedAt",
        header: "Last updated",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {formatDate(row.original.updatedAt)}
          </span>
        ),
      },
    ];
  }, [openTeamDrawer, ticketCountsByTeam, ticketTypes]);

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
            ? "No teams found"
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
                    header.id === "members" && "w-24",
                    header.id.startsWith("tickets-") && "w-24",
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
                No teams match your search.
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

      <MaintenanceTeamDetailDrawer
        onOpenChange={(next) => {
          setDrawerOpen(next);
          if (!next) {
            setDrawerTeamId(null);
          }
        }}
        open={drawerOpen}
        teamId={drawerTeamId}
      />
    </div>
  );
}
