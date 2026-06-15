import {
  RiAddLine,
  RiArrowRightSLine,
  RiMapLine,
  RiSearchLine,
  RiSettingsLine,
} from "@remixicon/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DottedRule } from "@/components/mockups/mr/DottedRule";
import { LocationTabs } from "@/components/mockups/mr/LocationTabs";
import * as Avatar from "@/components/ui/avatar";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as Select from "@/components/ui/select";
import { relId, relLabel } from "@/lib/mockups/helpers";
import { findById, getLocationScopedStats } from "@/lib/mockups/queries";
import type { Location } from "@/payload-types";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function LocationLayout({ children, params }: Props) {
  const { id } = await params;
  const location = await findById<Location>("locations", id);

  if (!location) {
    notFound();
  }

  const companyId = relId(location.company);
  if (!companyId) {
    notFound();
  }

  const stats = await getLocationScopedStats(location.id, companyId);

  return (
    <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-col">
      <header className="flex min-h-[88px] w-full flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8">
        <div className="flex flex-1 gap-4 lg:gap-3.5">
          <Avatar.Root size="24">
            <RiMapLine className="size-5 text-text-sub-600" />
          </Avatar.Root>
          <Breadcrumb.Root className="w-fit items-center">
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item asChild>
              <Link href="/mockups/mr/locations">Locations</Link>
            </Breadcrumb.Item>
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item asChild>
              <Link href={`/mockups/mr/companies/${companyId}`}>
                {relLabel(location.company)}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item active>{location.name}</Breadcrumb.Item>
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
              <Select.Item value="site">Sites</Select.Item>
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
            <div className="text-label-sm text-text-sub-600">Sub-locations</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.children}
              </div>
            </div>
            <div className="mt-1 text-label-xs text-text-sub-600">
              {relLabel(location.company)}
            </div>
          </div>
          <div className="relative hidden w-0 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-stroke-soft-200 sm:block" />
          <div className="w-full border-stroke-soft-200 border-t pt-4 pb-4 first:pl-0 last:pr-0 sm:w-1/2 sm:border-transparent sm:px-7 sm:pt-0 xl:w-1/4 xl:pb-0">
            <div className="text-label-sm text-text-sub-600">Assets</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.assets}
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-stroke-soft-200 xl:block" />
          <div className="w-full border-stroke-soft-200 border-t pt-4 pb-4 first:pl-0 last:pr-0 sm:w-1/2 sm:px-7 sm:pb-0 xl:w-1/4 xl:border-transparent xl:pt-0">
            <div className="text-label-sm text-text-sub-600">Movements</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.movements}
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-stroke-soft-200 sm:block" />
          <div className="w-full border-stroke-soft-200 border-t pt-4 first:pl-0 last:pr-0 sm:w-1/2 sm:px-7 xl:w-1/4 xl:border-transparent xl:pt-0">
            <div className="text-label-sm text-text-sub-600">Open tickets</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-text-strong-950 text-title-h5">
                {stats.openTickets}
              </div>
              <div className="text-label-xs text-text-sub-600">
                of {stats.tickets} total
              </div>
            </div>
          </div>
        </div>

        <DottedRule />
      </div>

      <LocationTabs locationId={location.id} />

      <div className="px-4 lg:px-8">{children}</div>
    </div>
  );
}
