import { Suspense } from "react";
import type { Where } from "payload";
import { CollectionToolbar } from "@/components/app/CollectionToolbar";
import { TicketsDataTable } from "@/components/app/TicketsDataTable";
import { TICKET_SORT_OPTIONS } from "@/lib/app/company-filters";
import {
  type ListSearchParams,
  parseListParams,
} from "@/lib/app/pagination";
import { getEntityFormOptions } from "@/lib/app/entity-form-options";
import { findCollection } from "@/lib/app/queries";
import type { Ticket } from "@/payload-types";

interface TicketsListViewProps {
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

export async function TicketsListView({
  where,
  searchParams,
  placeholder = "Search tickets...",
}: TicketsListViewProps) {
  const listParams = parseListParams(searchParams);
  const sort =
    listParams.sort === "name" ? "-reportedAt" : listParams.sort;

  const result = await findCollection<Ticket>("tickets", {
    page: listParams.page,
    limit: listParams.limit,
    sort,
    where,
  });
  const formOptions = await getEntityFormOptions();

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
          sortOptions={TICKET_SORT_OPTIONS}
        />
      </Suspense>

      <Suspense fallback={<TableFallback />}>
        <TicketsDataTable
          data={result.docs}
          formOptions={formOptions}
          limit={listParams.limit}
          page={currentPage}
          pageCount={pageCount}
          totalDocs={result.totalDocs}
        />
      </Suspense>
    </>
  );
}
