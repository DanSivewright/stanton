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

export const APP_BASE = "/" as const satisfies Route;

export interface AppNavItem {
  href: Route;
  icon: RemixiconComponentType;
  label: string;
}

export interface AppNavGroup {
  items: AppNavItem[];
  label: string;
}

export const APP_NAV: AppNavGroup[] = [
  {
    label: "Organization",
    items: [
      { label: "Home", href: "/", icon: RiDashboardLine },
      {
        label: "Companies",
        href: "/companies" as Route,
        icon: RiHomeLine,
      },
      { label: "Locations", href: "/locations", icon: RiMapLine },
    ],
  },
  // {
  //   label: "Assets",
  //   items: [
  //     { label: "Assets", href: "/assets", icon: RiToolsLine },
  //     {
  //       label: "Asset Movements",
  //       href: "/asset-movements",
  //       icon: RiExchangeLine,
  //     },
  //     {
  //       label: "Asset Categories",
  //       href: "/asset-categories",
  //       icon: RiListCheck2,
  //     },
  //     {
  //       label: "Asset Statuses",
  //       href: "/asset-statuses",
  //       icon: RiDonutChartLine,
  //     },
  //   ],
  // },
  {
    label: "Maintenance",
    items: [
      { label: "Assets", href: "/assets", icon: RiToolsLine },
      { label: "Tickets", href: "/tickets", icon: RiTicketLine },
      {
        label: "Maintenance Teams",
        href: "/maintenance-teams",
        icon: RiTeamLine,
      },
    ],
  },
];

export function isAppNavActive(pathname: string, href: Route): boolean {
  if (href === APP_BASE) {
    return pathname === APP_BASE;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
