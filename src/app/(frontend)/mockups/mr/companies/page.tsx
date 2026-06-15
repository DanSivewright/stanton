import {
  RiAddLine,
  RiArrowRightSLine,
  RiHomeLine,
  RiSearchLine,
  RiSettingsLine,
} from "@remixicon/react";
import type { Where } from "payload";
import { Suspense } from "react";
import { CompaniesDataTable } from "@/components/mockups/mr/CompaniesDataTable";
import { CompaniesToolbar } from "@/components/mockups/mr/CompaniesToolbar";
import * as Avatar from "@/components/ui/avatar";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as Select from "@/components/ui/select";
import { findCollection, getCompanyStats } from "@/lib/mockups/queries";
import type { Company } from "@/payload-types";

interface PageProps {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

function parsePage(value: string | undefined) {
  const page = Number(value);
  if (Number.isFinite(page) && page > 0) {
    return Math.floor(page);
  }
  return 1;
}

function parseLimit(value: string | undefined) {
  const limit = Number(value);
  if (!Number.isFinite(limit)) {
    return 10;
  }
  return Math.min(100, Math.max(5, Math.floor(limit)));
}

function DottedRule() {
  return (
    <div className="relative h-0 w-full">
      <div
        className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 text-stroke-soft-200"
        style={{
          background:
            "linear-gradient(90deg, currentcolor 4px, transparent 4px) 50% 50% / 10px 1px repeat-x",
        }}
      />
    </div>
  );
}

function TableFallback() {
  return (
    <div className="pb-8">
      <div className="h-48 animate-pulse rounded-xl bg-bg-weak-50" />
    </div>
  );
}

export default async function MrCompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const limit = parseLimit(params.limit);
  const query = params.q?.trim() ?? "";
  const sort = params.sort ?? "name";

  const where: Where | undefined = query
    ? {
        or: [{ name: { contains: query } }, { code: { contains: query } }],
      }
    : undefined;

  const [result, stats] = await Promise.all([
    findCollection<Company>("companies", {
      page,
      limit,
      sort,
      where,
    }),
    getCompanyStats(),
  ]);

  const companies = result.docs;
  const pageCount = Math.max(result.totalPages ?? 1, 1);
  const currentPage = Math.min(result.page ?? page, pageCount);

  return (
    <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-col">
      <header className="flex min-h-[88px] w-full flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8">
        <div className="flex flex-1 gap-4 lg:gap-3.5">
          <Avatar.Root size="24">
            <RiHomeLine className="size-5 text-text-sub-600" />
          </Avatar.Root>
          <Breadcrumb.Root className="w-fit items-center">
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item active>Companies</Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button.Root mode="ghost" variant="neutral">
            <Button.Icon as={RiSearchLine} />
          </Button.Root>
          <Button.Root mode="ghost" variant="neutral">
            <Button.Icon as={RiSettingsLine} />
          </Button.Root>
          <Select.Root>
            <Select.Trigger className="w-fit">
              <Select.Value placeholder="Filter by" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All</Select.Item>
              <Select.Item value="root">Root companies</Select.Item>
              <Select.Item value="subsidiary">Subsidiaries</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button.Root mode="filled" size="medium" variant="primary">
            <Button.Icon as={RiAddLine} />
            New Company
          </Button.Root>
        </div>
      </header>

      <div className="px-4 pb-6 lg:px-8">
        <DottedRule />

        <div className="flex flex-wrap py-6">
          <div className="w-full pb-4 first:pl-0 last:pr-0 sm:w-1/2 sm:px-7 sm:pb-0 xl:w-1/4 xl:pb-0">
            <div className="text-label-sm text-text-sub-600">
              Total Companies
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.total}
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-stroke-soft-200 sm:block" />
          <div className="w-full border-stroke-soft-200 border-t pt-4 pb-4 first:pl-0 last:pr-0 sm:w-1/2 sm:border-transparent sm:px-7 sm:pt-0 xl:w-1/4 xl:pb-0">
            <div className="text-label-sm text-text-sub-600">Subsidiaries</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.subsidiaries}
              </div>
              <div className="text-label-xs text-text-sub-600">
                of {stats.total} total
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-stroke-soft-200 xl:block" />
          <div className="w-full border-stroke-soft-200 border-t pt-4 pb-4 first:pl-0 last:pr-0 sm:w-1/2 sm:px-7 sm:pb-0 xl:w-1/4 xl:border-transparent xl:pt-0">
            <div className="text-label-sm text-text-sub-600">Locations</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.locations}
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-stroke-soft-200 sm:block" />
          <div className="w-full border-stroke-soft-200 border-t pt-4 first:pl-0 last:pr-0 sm:w-1/2 sm:px-7 xl:w-1/4 xl:border-transparent xl:pt-0">
            <div className="text-label-sm text-text-sub-600">Assets</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.assets}
              </div>
            </div>
          </div>
        </div>

        <DottedRule />

        <Suspense
          fallback={
            <div className="h-12 animate-pulse rounded-lg bg-bg-weak-50" />
          }
        >
          <CompaniesToolbar
            defaultLimit={limit}
            defaultQuery={query}
            defaultSort={sort}
          />
        </Suspense>

        <Suspense fallback={<TableFallback />}>
          <CompaniesDataTable
            data={companies}
            limit={limit}
            page={currentPage}
            pageCount={pageCount}
            totalDocs={result.totalDocs}
          />
        </Suspense>
      </div>
    </div>
  );
}
