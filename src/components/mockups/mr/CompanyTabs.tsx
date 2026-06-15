"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as TabMenuHorizontal from "@/components/ui/tab-menu-horizontal";
import {
  COMPANY_TABS,
  getCompanyTabHref,
  isCompanyTabActive,
} from "@/lib/mockups/mr/company-tabs";
import { cn } from "@/utils/cn";

interface CompanyTabsProps {
  companyId: string;
}

export function CompanyTabs({ companyId }: CompanyTabsProps) {
  const pathname = usePathname();

  return (
    <div className="px-4 lg:px-8">
      <TabMenuHorizontal.Root
        value={
          COMPANY_TABS.find((tab) =>
            isCompanyTabActive(pathname, companyId, tab.segment)
          )?.id ?? "companies"
        }
      >
        <TabMenuHorizontal.List wrapperClassName="rounded-none">
          {COMPANY_TABS.map((tab) => {
            const active = isCompanyTabActive(pathname, companyId, tab.segment);
            const Icon = tab.icon;

            return (
              <TabMenuHorizontal.Trigger
                asChild
                key={tab.id}
                value={tab.id}
              >
                <Link
                  className="flex items-center gap-1.5"
                  href={getCompanyTabHref(companyId, tab.segment)}
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
