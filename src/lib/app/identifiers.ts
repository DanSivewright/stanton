import type { CollectionSlug } from "./collection-slugs";

const IDENTIFIER_FIELDS: Partial<Record<CollectionSlug, string>> = {
  tickets: "ticketNumber",
  assets: "assetTag",
  employees: "employeeId",
  "asset-movements": "reference",
};

export function getIdentifierField(slug: CollectionSlug): string | null {
  return IDENTIFIER_FIELDS[slug] ?? null;
}

export function getDocIdentifier(
  doc: Record<string, unknown>,
  slug: CollectionSlug
): string {
  const field = IDENTIFIER_FIELDS[slug];
  if (field) {
    const val = doc[field];
    if (val != null && val !== "") {
      return String(val);
    }
  }
  return String(doc.id);
}

export function resolveIdentifierParam(
  param: string
): { mode: "id" | "field"; value: string } {
  if (/^[a-f0-9]{24}$/i.test(param)) {
    return { mode: "id", value: param };
  }
  return { mode: "field", value: decodeURIComponent(param) };
}

export function getDocTitle(
  doc: Record<string, unknown>,
  slug: CollectionSlug
): string {
  switch (slug) {
    case "employees":
      return String(doc.fullName ?? doc.employeeId ?? "Employee");
    case "users":
      return String(doc.email ?? "User");
    case "tickets":
      return String(doc.title ?? doc.ticketNumber ?? "Ticket");
    case "asset-movements":
      return String(doc.reference ?? "Movement");
    case "assets":
      return String(doc.name ?? doc.assetTag ?? "Asset");
    default:
      return String(doc.name ?? doc.id ?? "Record");
  }
}
