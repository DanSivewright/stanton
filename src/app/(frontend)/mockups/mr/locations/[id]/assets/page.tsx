import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AssetsDataTable } from "@/components/mockups/mr/AssetsDataTable";
import { CollectionToolbar } from "@/components/mockups/mr/CollectionToolbar";
import { NAME_SORT_OPTIONS } from "@/lib/mockups/mr/company-filters";
import { relId } from "@/lib/mockups/helpers";
import { buildLocationListWhere } from "@/lib/mockups/mr/location-filters";
import { parseListParams } from "@/lib/mockups/mr/pagination";
import { findById, findCollection } from "@/lib/mockups/queries";
import type { Asset, Location } from "@/payload-types";

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

export default async function LocationAssetsPage({
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
    "assets",
    location.id,
    companyId,
    listParams.query
  );

  const result = await findCollection<Asset>("assets", {
    page: listParams.page,
    limit: listParams.limit,
    sort: listParams.sort,
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
          defaultSort={listParams.sort}
          placeholder="Search assets..."
          sortOptions={NAME_SORT_OPTIONS}
        />
      </Suspense>

      <Suspense fallback={<TableFallback />}>
        <AssetsDataTable
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
