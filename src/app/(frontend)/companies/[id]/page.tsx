import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionToolbar } from "@/components/app/CollectionToolbar";
import { CompaniesDataTable } from "@/components/app/CompaniesDataTable";
import {
  buildCompanyListWhere,
  NAME_SORT_OPTIONS,
} from "@/lib/app/company-filters";
import { parseListParams } from "@/lib/app/pagination";
import { findById, findCollection } from "@/lib/app/queries";
import type { Company } from "@/payload-types";

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

export default async function CompanySubsidiariesPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const company = await findById<Company>("companies", id);

  if (!company) {
    notFound();
  }

  const listParams = parseListParams(await searchParams);
  const where = buildCompanyListWhere(
    "companies",
    company.id,
    listParams.query
  );

  const result = await findCollection<Company>("companies", {
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
          placeholder="Search subsidiaries..."
          sortOptions={NAME_SORT_OPTIONS}
        />
      </Suspense>

      <Suspense fallback={<TableFallback />}>
        <CompaniesDataTable
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
