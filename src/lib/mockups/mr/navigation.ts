import type { RemixiconComponentType } from "@remixicon/react";
import {
  // RiDonutChartLine,
  // RiExchangeLine,
  RiDashboardLine,
  RiHomeLine,
  // RiListCheck2,
  RiMapLine,
  RiTeamLine,
  RiTicketLine,
  RiToolsLine,
} from "@remixicon/react";
import type { Route } from "next";

export const MR_BASE = "/mockups/mr" as const satisfies Route;

export interface MrNavItem {
  href: Route;
  icon: RemixiconComponentType;
  label: string;
}

export interface MrNavGroup {
  items: MrNavItem[];
  label: string;
}

export const MR_NAV: MrNavGroup[] = [
  {
    label: "Organization",
    items: [
      { label: "Home", href: "/mockups/mr", icon: RiDashboardLine },
      {
        label: "Companies",
        href: "/mockups/mr/companies" as Route,
        icon: RiHomeLine,
      },
      { label: "Locations", href: "/mockups/mr/locations", icon: RiMapLine },
    ],
  },
  // {
  //   label: "Assets",
  //   items: [
  //     { label: "Assets", href: "/mockups/mr/assets", icon: RiToolsLine },
  //     {
  //       label: "Asset Movements",
  //       href: "/mockups/mr/asset-movements",
  //       icon: RiExchangeLine,
  //     },
  //     {
  //       label: "Asset Categories",
  //       href: "/mockups/mr/asset-categories",
  //       icon: RiListCheck2,
  //     },
  //     {
  //       label: "Asset Statuses",
  //       href: "/mockups/mr/asset-statuses",
  //       icon: RiDonutChartLine,
  //     },
  //   ],
  // },
  {
    label: "Maintenance",
    items: [
      { label: "Assets", href: "/mockups/mr/assets", icon: RiToolsLine },
      { label: "Tickets", href: "/mockups/mr/tickets", icon: RiTicketLine },
      {
        label: "Maintenance Teams",
        href: "/mockups/mr/maintenance-teams",
        icon: RiTeamLine,
      },
    ],
  },
];

export function isMrNavActive(pathname: string, href: Route): boolean {
  if (href === MR_BASE) {
    return pathname === MR_BASE;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
