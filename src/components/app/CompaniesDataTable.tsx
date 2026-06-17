// @ts-nocheck
"use client";

import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import * as Avatar from "@/components/ui/avatar";
import * as Checkbox from "@/components/ui/checkbox";
import * as Pagination from "@/components/ui/pagination";
import * as Table from "@/components/ui/table";
import { formatDate, relLabel } from "@/lib/app/helpers";
import type { Company } from "@/payload-types";
import { cn } from "@/utils/cn";

interface CompaniesDataTableProps {
  data: Company[];
  limit: number;
  page: number;
  pageCount: number;
  totalDocs: number;
}

function buildPageNumbers(current: number, total: number): number[] {
  if (total <= 1) {
    return [1];
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);

  return [...pages]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= total)
    .sort((a, b) => a - b);
}

export function CompaniesDataTable({
  data,
  limit,
  page,
  pageCount,
  totalDocs,
}: CompaniesDataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox.Root
            aria-label="Select all companies on this page"
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
        header: "Company",
        cell: ({ row }) => (
          <Link
            className="flex items-center gap-3"
            href={`/companies/${row.original.id}`}
          >
            <Avatar.Root placeholderType="company" size="40" />
            <div className="min-w-0">
              <div className="truncate font-medium text-text-strong-950">
                {row.original.name}
              </div>
              <div className="truncate text-paragraph-xs text-text-sub-600">
                {row.original.code}
              </div>
            </div>
          </Link>
        ),
      },
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <span className="font-mono text-paragraph-sm text-text-sub-600">
            {row.original.code}
          </span>
        ),
      },
      {
        id: "parent",
        header: "Parent company",
        cell: ({ row }) => (
          <span className="text-paragraph-sm text-text-sub-600">
            {relLabel(row.original.parent)}
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
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
      rowSelection,
    },
  });

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  const pageNumbers = buildPageNumbers(page, pageCount);
  const rangeStart = totalDocs === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, totalDocs);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-paragraph-sm text-text-sub-600">
          {totalDocs === 0
            ? "No companies found"
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
                    header.id === "code" && "w-28",
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
                No companies match your search.
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

      {pageCount > 1 ? (
        <div className="mt-6 flex justify-center">
          <Pagination.Root>
            <Pagination.NavButton
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              <Pagination.NavIcon as={RiArrowLeftSLine} />
            </Pagination.NavButton>

            {pageNumbers.map((pageNumber, index) => {
              const previous = pageNumbers[index - 1];
              const showEllipsis =
                previous != null && pageNumber - previous > 1;

              return (
                <span className="contents" key={pageNumber}>
                  {showEllipsis ? (
                    <Pagination.Item aria-hidden disabled>
                      …
                    </Pagination.Item>
                  ) : null}
                  <Pagination.Item
                    aria-label={`Page ${pageNumber}`}
                    current={pageNumber === page}
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                </span>
              );
            })}

            <Pagination.NavButton
              aria-label="Next page"
              disabled={page >= pageCount}
              onClick={() => goToPage(page + 1)}
            >
              <Pagination.NavIcon as={RiArrowRightSLine} />
            </Pagination.NavButton>
          </Pagination.Root>
        </div>
      ) : null}
    </div>
  );
}
