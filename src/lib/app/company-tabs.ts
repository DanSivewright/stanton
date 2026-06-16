import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiExchangeLine,
  RiHomeLine,
  RiMapLine,
  RiTeamLine,
  RiTicketLine,
  RiToolsLine,
  RiUserLine,
} from "@remixicon/react";
import type { Route } from "next";

export interface CompanyTab {
  icon: RemixiconComponentType;
  id: string;
  label: string;
  segment: string;
}

export const COMPANY_TABS: CompanyTab[] = [
  { id: "companies", label: "Companies", segment: "", icon: RiHomeLine },
  { id: "locations", label: "Locations", segment: "locations", icon: RiMapLine },
  { id: "assets", label: "Assets", segment: "assets", icon: RiToolsLine },
  { id: "movements", label: "Movements", segment: "asset-movements", icon: RiExchangeLine },
  { id: "tickets", label: "Tickets", segment: "tickets", icon: RiTicketLine },
  { id: "employees", label: "Employees", segment: "employees", icon: RiUserLine },
  {
    id: "maintenance-teams",
    label: "Maintenance Teams",
    segment: "maintenance-teams",
    icon: RiTeamLine,
  },
];

export function getCompanyBasePath(companyId: string): Route {
  return `/companies/${encodeURIComponent(companyId)}` as Route;
}

export function getCompanyTabHref(companyId: string, segment: string): Route {
  const base = getCompanyBasePath(companyId);
  if (!segment) {
    return base;
  }
  return `${base}/${segment}` as Route;
}

export function isCompanyTabActive(
  pathname: string,
  companyId: string,
  segment: string
): boolean {
  const base = getCompanyBasePath(companyId);
  if (!segment) {
    return pathname === base;
  }
  const href = `${base}/${segment}`;
  return pathname === href || pathname.startsWith(`${href}/`);
}
