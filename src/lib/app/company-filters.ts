import type { Where } from "payload";
import type { CollectionSlug } from "@/lib/app/collection-slugs";

export function companyScope(companyId: string): Where {
  return { company: { equals: companyId } };
}

export function subsidiaryScope(companyId: string): Where {
  return { parent: { equals: companyId } };
}

export function mergeWhere(base: Where, search?: Where): Where | undefined {
  if (!search) {
    return base;
  }
  return { and: [base, search] };
}

const SEARCH_FIELDS: Partial<
  Record<CollectionSlug, { fields: string[]; useParent?: boolean }>
> = {
  companies: { fields: ["name", "code"], useParent: true },
  locations: { fields: ["name"] },
  assets: { fields: ["name", "assetTag"] },
  "asset-movements": { fields: ["reference"] },
  tickets: { fields: ["title", "ticketNumber"] },
  employees: { fields: ["fullName", "employeeId"] },
  "maintenance-teams": { fields: ["name"] },
};

export function buildCompanyListWhere(
  slug: CollectionSlug,
  companyId: string,
  query: string
): Where {
  const config = SEARCH_FIELDS[slug];
  const base = config?.useParent
    ? subsidiaryScope(companyId)
    : companyScope(companyId);

  const trimmed = query.trim();
  if (!trimmed || !config) {
    return base;
  }

  return mergeWhere(base, {
    or: config.fields.map((field) => ({
      [field]: { contains: trimmed },
    })),
  }) as Where;
}

export const NAME_SORT_OPTIONS = [
  { value: "name", label: "Name (A–Z)" },
  { value: "-name", label: "Name (Z–A)" },
  { value: "-updatedAt", label: "Recently updated" },
  { value: "updatedAt", label: "Oldest updated" },
] as const;

export const TICKET_SORT_OPTIONS = [
  { value: "-reportedAt", label: "Recently reported" },
  { value: "reportedAt", label: "Oldest reported" },
  { value: "title", label: "Title (A–Z)" },
  { value: "-title", label: "Title (Z–A)" },
] as const;

export const MOVEMENT_SORT_OPTIONS = [
  { value: "-movedAt", label: "Recently moved" },
  { value: "movedAt", label: "Oldest moved" },
  { value: "-updatedAt", label: "Recently updated" },
] as const;

export const EMPLOYEE_SORT_OPTIONS = [
  { value: "fullName", label: "Name (A–Z)" },
  { value: "-fullName", label: "Name (Z–A)" },
  { value: "-updatedAt", label: "Recently updated" },
] as const;
