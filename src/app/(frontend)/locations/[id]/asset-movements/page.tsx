import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AssetMovementsDataTable } from "@/components/app/AssetMovementsDataTable";
import { CollectionToolbar } from "@/components/app/CollectionToolbar";
import { MOVEMENT_SORT_OPTIONS } from "@/lib/app/company-filters";
import { relId } from "@/lib/app/helpers";
import { buildLocationListWhere } from "@/lib/app/location-filters";
import { parseListParams } from "@/lib/app/pagination";
import { findById, findCollection } from "@/lib/app/queries";
import type { AssetMovement, Location } from "@/payload-types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

function TableFallback() {
  return (
    <div className="pb-8">
      <div className="h-48 animate-pulse rounded-xl bg-bg-weak-50" />
    </div>
  );
}

export default async function LocationAssetMovementsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const location = await findById<Location>("locations", id);

  if (!location) {
    notFound();
  }

  const companyId = relId(location.company);
  if (!companyId) {
    notFound();
  }

  const listParams = parseListParams(await searchParams);
  const where = buildLocationListWhere(
    "asset-movements",
    location.id,
    companyId,
    listParams.query
  );
  const sort = listParams.sort === "name" ? "-movedAt" : listParams.sort;

  const result = await findCollection<AssetMovement>("asset-movements", {
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
          placeholder="Search movements..."
          sortOptions={MOVEMENT_SORT_OPTIONS}
        />
      </Suspense>

      <Suspense fallback={<TableFallback />}>
        <AssetMovementsDataTable
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
