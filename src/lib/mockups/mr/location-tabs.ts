import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiExchangeLine,
  RiHomeLine,
  RiTeamLine,
  RiTicketLine,
  RiToolsLine,
  RiUserLine,
} from "@remixicon/react";
import type { Route } from "next";

export interface LocationTab {
  icon: RemixiconComponentType;
  id: string;
  label: string;
  segment: string;
}

export const LOCATION_TABS: LocationTab[] = [
  { id: "overview", label: "Overview", segment: "", icon: RiHomeLine },
  { id: "assets", label: "Assets", segment: "assets", icon: RiToolsLine },
  { id: "tickets", label: "Tickets", segment: "tickets", icon: RiTicketLine },
  {
    id: "maintenance-teams",
    label: "Teams",
    segment: "maintenance-teams",
    icon: RiTeamLine,
  },
  {
    id: "movements",
    label: "Movements",
    segment: "asset-movements",
    icon: RiExchangeLine,
  },
  { id: "employees", label: "Employees", segment: "employees", icon: RiUserLine },
];

export function getLocationBasePath(locationId: string): Route {
  return `/mockups/mr/locations/${encodeURIComponent(locationId)}` as Route;
}

export function getLocationTabHref(locationId: string, segment: string): Route {
  const base = getLocationBasePath(locationId);
  if (!segment) {
    return base;
  }
  return `${base}/${segment}` as Route;
}

export function isLocationTabActive(
  pathname: string,
  locationId: string,
  segment: string
): boolean {
  const base = getLocationBasePath(locationId);
  if (!segment) {
    return pathname === base;
  }
  const href = `${base}/${segment}`;
  return pathname === href || pathname.startsWith(`${href}/`);
}
