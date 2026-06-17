import type { Where } from "payload";
import { Suspense } from "react";
import { AssetsDataTable } from "@/components/app/AssetsDataTable";
import { CollectionToolbar } from "@/components/app/CollectionToolbar";
import { NAME_SORT_OPTIONS } from "@/lib/app/company-filters";
import { getEntityFormOptions } from "@/lib/app/entity-form-options";
import { type ListSearchParams, parseListParams } from "@/lib/app/pagination";
import { findCollection } from "@/lib/app/queries";
import type { Asset } from "@/payload-types";

interface AssetsListViewProps {
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

export async function AssetsListView({
  where,
  searchParams,
  placeholder = "Search assets...",
}: AssetsListViewProps) {
  const listParams = parseListParams(searchParams);
  const result = await findCollection<Asset>("assets", {
    page: listParams.page,
    limit: listParams.limit,
    sort: listParams.sort,
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
          defaultSort={listParams.sort}
          placeholder={placeholder}
          sortOptions={NAME_SORT_OPTIONS}
        />
      </Suspense>

      <Suspense fallback={<TableFallback />}>
        <AssetsDataTable
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
