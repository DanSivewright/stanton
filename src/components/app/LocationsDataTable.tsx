"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTablePagination } from "@/components/app/DataTablePagination";
import { LocationFormModal } from "@/components/app/forms/locations/LocationFormModal";
import { LocationTypeBadge } from "@/components/app/LocationTypeBadge";
import * as Avatar from "@/components/ui/avatar";
import * as Button from "@/components/ui/button";
import * as Checkbox from "@/components/ui/checkbox";
import * as Table from "@/components/ui/table";
import type { EntityFormOptions } from "@/lib/app/entity-form-options";
import { formatDate, relLabel } from "@/lib/app/helpers";
import { getLocationBasePath } from "@/lib/app/location-tabs";
import {
  getLocationKindType,
  getLocationStructureType,
} from "@/lib/app/location-type-badge";
import type { LocationTicketCounts } from "@/lib/app/queries";
import type { Location, TicketType } from "@/payload-types";
import { cn } from "@/utils/cn";

interface LocationsDataTableProps {
  data: Location[];
  formOptions: EntityFormOptions;
  limit: number;
  page: number;
  pageCount: number;
  ticketCountsByLocation: LocationTicketCounts;
  ticketTypes: TicketType[];
  totalDocs: number;
}

export function LocationsDataTable({
  data,
  formOptions,
  limit,
  page,
  pageCount,
  ticketCountsByLocation,
  ticketTypes,
  totalDocs,
}: LocationsDataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [editingLocation, setEditingLocation] = useState<Location | undefined>();
  const [formOpen, setFormOpen] = useState(false);

  const columns = useMemo<ColumnDef<Location>[]>(() => {
    const ticketTypeColumns: ColumnDef<Location>[] = ticketTypes.map(
      (ticketType) => ({
        id: `tickets-${ticketType.id}`,
        header: ticketType.name,
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {ticketCountsByLocation[row.original.id]?.[ticketType.id] ?? 0}
          </span>
        ),
      })
    );

    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox.Root
            aria-label="Select all locations on this page"
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
        header: "Location",
        cell: ({ row }) => {
          const kindMeta = getLocationKindType(row.original.kind);

          return (
            <Link
              className="flex items-center gap-3"
              href={getLocationBasePath(row.original.id)}
            >
              <Avatar.Root placeholderType="company" size="40" />
              <div className="min-w-0">
                <div className="truncate font-medium text-text-strong-950">
                  {row.original.name}
                </div>
                {kindMeta ? (
                  <div className="mt-1">
                    <LocationTypeBadge meta={kindMeta} />
                  </div>
                ) : null}
              </div>
            </Link>
          );
        },
      },
      {
        id: "parent",
        header: "Parent",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {relLabel(row.original.parent)}
          </span>
        ),
      },
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => (
          <LocationTypeBadge meta={getLocationStructureType(row.original)} />
        ),
      },
      {
        id: "assets",
        header: "Assets",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {row.original.assets?.totalDocs ?? 0}
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
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button.Root
            mode="ghost"
            onClick={() => {
              setEditingLocation(row.original);
              setFormOpen(true);
            }}
            size="xsmall"
            type="button"
            variant="neutral"
          >
            Edit
          </Button.Root>
        ),
      },
    ];
  }, [ticketCountsByLocation, ticketTypes]);

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
            ? "No locations found"
            : `Showing ${rangeStart}–${rangeEnd} of ${totalDocs}`}
          {selectedCount > 0 ? ` · ${selectedCount} selected` : null}
        </p>
        <Button.Root
          onClick={() => {
            setEditingLocation(undefined);
            setFormOpen(true);
          }}
          size="small"
          type="button"
          variant="primary"
        >
          Create Location
        </Button.Root>
      </div>

      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Head
                  className={cn(
                    header.id === "select" && "w-12",
                    header.id === "type" && "w-28",
                    header.id === "assets" && "w-20",
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
                No locations match your search.
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
      <LocationFormModal
        companies={formOptions.companies}
        location={editingLocation}
        locations={formOptions.locations}
        mode={editingLocation ? "edit" : "create"}
        onOpenChange={setFormOpen}
        open={formOpen}
      />
    </div>
  );
}
