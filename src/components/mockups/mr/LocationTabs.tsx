"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";
import {
  LOCATION_TABS,
  getLocationTabHref,
  isLocationTabActive,
} from "@/lib/mockups/mr/location-tabs";
import { cn } from "@/utils/cn";

interface LocationTabsProps {
  locationId: string;
}

export function LocationTabs({ locationId }: LocationTabsProps) {
  const pathname = usePathname();

  return (
    <div className="px-4 lg:px-8">
      <TabMenuHorizontal.Root
        value={
          LOCATION_TABS.find((tab) =>
            isLocationTabActive(pathname, locationId, tab.segment)
          )?.id ?? "overview"
        }
      >
        <TabMenuHorizontal.List wrapperClassName="rounded-none">
          {LOCATION_TABS.map((tab) => {
            const active = isLocationTabActive(
              pathname,
              locationId,
              tab.segment
            );
            const Icon = tab.icon;

            return (
              <TabMenuHorizontal.Trigger asChild key={tab.id} value={tab.id}>
                <Link
                  className="flex items-center gap-1.5"
                  href={getLocationTabHref(locationId, tab.segment)}
                >
                  <TabMenuHorizontal.Icon
                    as={Icon}
                    className={cn(active && "text-primary-base")}
                  />
                  {tab.label}
                </Link>
              </TabMenuHorizontal.Trigger>
            );
          })}
        </TabMenuHorizontal.List>
      </TabMenuHorizontal.Root>
    </div>
  );
}
