import {
  RiAddLine,
  RiArrowRightSLine,
  RiMapLine,
  RiSearchLine,
  RiSettingsLine,
} from "@remixicon/react";
import { Suspense } from "react";
import { LocationsListView } from "@/components/app/LocationsListView";
import { DottedRule } from "@/components/app/DottedRule";
import * as Avatar from "@/components/ui/avatar";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as Select from "@/components/ui/select";
import { buildGlobalLocationListWhere } from "@/lib/app/location-filters";
import { getLocationStats } from "@/lib/app/queries";

interface PageProps {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function LocationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const where = buildGlobalLocationListWhere(query);
  const stats = await getLocationStats();

  return (
    <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-col">
      <header className="flex min-h-[88px] w-full flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8">
        <div className="flex flex-1 gap-4 lg:gap-3.5">
          <Avatar.Root size="24">
            <RiMapLine className="size-5 text-text-sub-600" />
          </Avatar.Root>
          <Breadcrumb.Root className="w-fit items-center">
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item active>Locations</Breadcrumb.Item>
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
              <Select.Item value="group">Groups</Select.Item>
              <Select.Item value="site">Location Leaves</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button.Root mode="filled" size="medium" variant="primary">
            <Button.Icon as={RiAddLine} />
            New Location
          </Button.Root>
        </div>
      </header>

      <div className="px-4 pb-6 lg:px-8">
        <DottedRule />

        <div className="flex flex-wrap py-6">
          <div className="w-full pb-4 first:pl-0 last:pr-0 sm:w-1/2 sm:px-7 sm:pb-0 xl:w-1/4 xl:pb-0">
            <div className="text-label-sm text-text-sub-600">
              Total Locations
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.total}
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-stroke-soft-200 sm:block" />
          <div className="w-full border-stroke-soft-200 border-t pt-4 pb-4 first:pl-0 last:pr-0 sm:w-1/2 sm:border-transparent sm:px-7 sm:pt-0 xl:w-1/4 xl:pb-0">
            <div className="text-label-sm text-text-sub-600">Groups</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.groups}
              </div>
              <div className="text-label-xs text-text-sub-600">
                of {stats.total} total
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-stroke-soft-200 xl:block" />
          <div className="w-full border-stroke-soft-200 border-t pt-4 pb-4 first:pl-0 last:pr-0 sm:w-1/2 sm:px-7 sm:pb-0 xl:w-1/4 xl:border-transparent xl:pt-0">
            <div className="text-label-sm text-text-sub-600">Location Leaves</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.sites}
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
          <LocationsListView searchParams={params} where={where} />
        </Suspense>
      </div>
    </div>
  );
}
