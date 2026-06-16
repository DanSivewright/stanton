import { Suspense } from "react";
import type { Where } from "payload";
import { CollectionToolbar } from "@/components/app/CollectionToolbar";
import { EmployeesDataTable } from "@/components/app/EmployeesDataTable";
import { EMPLOYEE_SORT_OPTIONS } from "@/lib/app/company-filters";
import {
  type ListSearchParams,
  parseListParams,
} from "@/lib/app/pagination";
import { findCollection } from "@/lib/app/queries";
import type { Employee } from "@/payload-types";

interface EmployeesListViewProps {
  placeholder?: string;
  searchParams: ListSearchParams;
  where?: Where;
}

function TableFallback() {
  return (
    <div className="pb-8">
      <div className="h-48 animate-pulse rounded-xl bg-bg-weak-50" />
    </div>
  );
}

export async function EmployeesListView({
  where,
  searchParams,
  placeholder = "Search employees...",
}: EmployeesListViewProps) {
  const listParams = parseListParams(searchParams);
  const sort =
    listParams.sort === "name" ? "fullName" : listParams.sort;

  const result = await findCollection<Employee>("employees", {
    page: listParams.page,
    limit: listParams.limit,
    sort,
    where,
  });

  const pageCount = Math.max(result.totalPages ?? 1, 1);
  const currentPage = Math.min(result.page ?? listParams.page, pageCount);

  return (
    <>
      <Suspense
        fallback={
          <div className="h-12 animate-pulse rounded-lg bg-bg-weak-50" />
        }
      >
        <CollectionToolbar
          defaultLimit={listParams.limit}
          defaultQuery={listParams.query}
          defaultSort={sort}
          placeholder={placeholder}
          sortOptions={EMPLOYEE_SORT_OPTIONS}
        />
      </Suspense>

      <Suspense fallback={<TableFallback />}>
        <EmployeesDataTable
          data={result.docs}
          limit={listParams.limit}
          page={currentPage}
          pageCount={pageCount}
          totalDocs={result.totalDocs}
        />
      </Suspense>
    </>
  );
}
