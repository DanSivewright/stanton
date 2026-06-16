import type { Where } from "payload";
import type { CollectionSlug } from "@/lib/app/collection-slugs";
import { companyScope, mergeWhere } from "@/lib/app/company-filters";

export function locationChildScope(locationId: string): Where {
  return { parent: { equals: locationId } };
}

export function locationScope(locationId: string): Where {
  return { location: { equals: locationId } };
}

export function locationMovementScope(locationId: string): Where {
  return {
    or: [
      { fromLocation: { equals: locationId } },
      { toLocation: { equals: locationId } },
    ],
  };
}

const LOCATION_SEARCH_FIELDS: Partial<
  Record<CollectionSlug, { fields: string[]; useChild?: boolean; useCompany?: boolean; useMovement?: boolean }>
> = {
  locations: { fields: ["name"], useChild: true },
  assets: { fields: ["name", "assetTag"] },
  tickets: { fields: ["title", "ticketNumber"] },
  "asset-movements": { fields: ["reference"], useMovement: true },
  employees: { fields: ["fullName", "employeeId"], useCompany: true },
  "maintenance-teams": { fields: ["name"], useCompany: true },
};

export function buildLocationListWhere(
  slug: CollectionSlug,
  locationId: string,
  companyId: string,
  query: string
): Where {
  const config = LOCATION_SEARCH_FIELDS[slug];

  let base: Where;
  if (config?.useChild) {
    base = locationChildScope(locationId);
  } else if (config?.useCompany) {
    base = companyScope(companyId);
  } else if (config?.useMovement) {
    base = locationMovementScope(locationId);
  } else {
    base = locationScope(locationId);
  }

  const trimmed = query.trim();
  if (!trimmed) {
    return base;
  }
  if (!config) {
    return base;
  }

  return mergeWhere(base, {
    or: config.fields.map((field) => ({
      [field]: { contains: trimmed },
    })),
  }) as Where;
}

export function buildGlobalLocationListWhere(query: string): Where | undefined {
  const trimmed = query.trim();
  if (!trimmed) {
    return;
  }

  return { name: { contains: trimmed } };
}
