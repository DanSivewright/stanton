import config from "@payload-config";
import { getPayload, type PaginatedDocs, type Where } from "payload";
import { getIdentifierField, resolveIdentifierParam } from "./identifiers";
import type { CollectionSlug } from "./collection-slugs";

const DEFAULT_DEPTH = 2;

function getPayloadClient() {
  return getPayload({ config });
}

type JoinQueryOptions = Record<
  string,
  | {
      count?: boolean;
      limit?: number;
      page?: number;
      sort?: string;
      where?: Where;
    }
  | false
>;

export async function findCollection<T = Record<string, unknown>>(
  slug: CollectionSlug,
  options?: {
    joins?: JoinQueryOptions;
    limit?: number;
    page?: number;
    sort?: string;
    where?: Where;
  }
): Promise<PaginatedDocs<T>> {
  const payload = await getPayloadClient();
  return payload.find({
    collection: slug,
    depth: DEFAULT_DEPTH,
    joins: options?.joins as never,
    limit: options?.limit ?? 100,
    page: options?.page ?? 1,
    sort: options?.sort ?? "-updatedAt",
    where: options?.where,
    overrideAccess: true,
  }) as Promise<PaginatedDocs<T>>;
}

export async function getCompanyScopedStats(companyId: string) {
  const payload = await getPayloadClient();
  const companyFilter = { company: { equals: companyId } };
  const parentFilter = { parent: { equals: companyId } };

  const [
    subsidiaries,
    locations,
    assets,
    movements,
    tickets,
    employees,
    teams,
    openTickets,
  ] = await Promise.all([
    payload.find({
      collection: "companies",
      where: parentFilter,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "locations",
      where: companyFilter,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "assets",
      where: companyFilter,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "asset-movements",
      where: companyFilter,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "tickets",
      where: companyFilter,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "employees",
      where: companyFilter,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "maintenance-teams",
      where: companyFilter,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "tickets",
      where: {
        and: [companyFilter, { status: { in: ["open", "in_progress"] } }],
      },
      limit: 0,
      overrideAccess: true,
    }),
  ]);

  return {
    subsidiaries: subsidiaries.totalDocs,
    locations: locations.totalDocs,
    assets: assets.totalDocs,
    movements: movements.totalDocs,
    tickets: tickets.totalDocs,
    employees: employees.totalDocs,
    teams: teams.totalDocs,
    openTickets: openTickets.totalDocs,
  };
}

export async function getLocationScopedStats(
  locationId: string,
  companyId: string
) {
  const payload = await getPayloadClient();
  const childFilter = { parent: { equals: locationId } };
  const locationFilter = { location: { equals: locationId } };
  const movementFilter: Where = {
    or: [
      { fromLocation: { equals: locationId } },
      { toLocation: { equals: locationId } },
    ],
  };
  const companyFilter = { company: { equals: companyId } };

  const [children, assets, movements, tickets, openTickets, employees, teams] =
    await Promise.all([
      payload.find({
        collection: "locations",
        where: childFilter,
        limit: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "assets",
        where: locationFilter,
        limit: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "asset-movements",
        where: movementFilter,
        limit: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "tickets",
        where: locationFilter,
        limit: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "tickets",
        where: {
          and: [locationFilter, { status: { in: ["open", "in_progress"] } }],
        },
        limit: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "employees",
        where: companyFilter,
        limit: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "maintenance-teams",
        where: companyFilter,
        limit: 0,
        overrideAccess: true,
      }),
    ]);

  return {
    children: children.totalDocs,
    assets: assets.totalDocs,
    movements: movements.totalDocs,
    tickets: tickets.totalDocs,
    openTickets: openTickets.totalDocs,
    employees: employees.totalDocs,
    teams: teams.totalDocs,
  };
}

export async function getLocationStats() {
  const payload = await getPayloadClient();

  const [total, groups, assets, tickets] = await Promise.all([
    payload.find({ collection: "locations", limit: 0, overrideAccess: true }),
    payload.find({
      collection: "locations",
      where: { isGroup: { equals: true } },
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({ collection: "assets", limit: 0, overrideAccess: true }),
    payload.find({ collection: "tickets", limit: 0, overrideAccess: true }),
  ]);

  return {
    total: total.totalDocs,
    groups: groups.totalDocs,
    sites: total.totalDocs - groups.totalDocs,
    assets: assets.totalDocs,
    tickets: tickets.totalDocs,
  };
}

export async function getCompanyStats() {
  const payload = await getPayloadClient();

  const [total, subsidiaries, locations, assets] = await Promise.all([
    payload.find({ collection: "companies", limit: 0, overrideAccess: true }),
    payload.find({
      collection: "companies",
      where: { parent: { exists: true } },
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({ collection: "locations", limit: 0, overrideAccess: true }),
    payload.find({ collection: "assets", limit: 0, overrideAccess: true }),
  ]);

  return {
    total: total.totalDocs,
    subsidiaries: subsidiaries.totalDocs,
    locations: locations.totalDocs,
    assets: assets.totalDocs,
  };
}

export async function findById<T = Record<string, unknown>>(
  slug: CollectionSlug,
  id: string
): Promise<T | null> {
  const payload = await getPayloadClient();
  try {
    return (await payload.findByID({
      collection: slug,
      id,
      depth: DEFAULT_DEPTH,
      overrideAccess: true,
    })) as T;
  } catch {
    return null;
  }
}

export async function findByIdentifier<T = Record<string, unknown>>(
  slug: CollectionSlug,
  param: string
): Promise<T | null> {
  const { mode, value } = resolveIdentifierParam(param);

  if (mode === "id") {
    return findById(slug, value);
  }

  const field = getIdentifierField(slug);
  if (!field) {
    return findById(slug, value);
  }

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: slug,
    where: { [field]: { equals: value } },
    depth: DEFAULT_DEPTH,
    limit: 1,
    overrideAccess: true,
  });

  return (result.docs[0] as T) ?? null;
}

export type SearchHit = {
  slug: CollectionSlug;
  doc: Record<string, unknown>;
};

export async function searchRecords(
  query: string,
  limit = 20
): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) {
    return [];
  }

  const payload = await getPayloadClient();
  const searchConfigs: { slug: CollectionSlug; where: Where }[] = [
    {
      slug: "tickets",
      where: {
        or: [{ title: { contains: q } }, { ticketNumber: { contains: q } }],
      },
    },
    {
      slug: "assets",
      where: {
        or: [{ name: { contains: q } }, { assetTag: { contains: q } }],
      },
    },
    {
      slug: "employees",
      where: {
        or: [{ fullName: { contains: q } }, { employeeId: { contains: q } }],
      },
    },
    {
      slug: "companies",
      where: {
        or: [{ name: { contains: q } }, { code: { contains: q } }],
      },
    },
    {
      slug: "locations",
      where: { name: { contains: q } },
    },
  ];

  const batches = await Promise.all(
    searchConfigs.map(async ({ slug, where }) => {
      const result = await payload.find({
        collection: slug,
        where,
        limit: 5,
        depth: 1,
        overrideAccess: true,
      });
      return result.docs.map((doc) => ({
        slug,
        doc: doc as unknown as Record<string, unknown>,
      }));
    })
  );

  return batches.flat().slice(0, limit);
}

export async function getDashboardStats() {
  const payload = await getPayloadClient();
  const slugs: CollectionSlug[] = [
    "companies",
    "locations",
    "assets",
    "tickets",
    "employees",
    "maintenance-teams",
    "asset-movements",
  ];

  const counts = await Promise.all(
    slugs.map(async (slug) => {
      const result = await payload.find({
        collection: slug,
        limit: 0,
        overrideAccess: true,
      });
      return [slug, result.totalDocs] as const;
    })
  );

  const openTickets = await payload.find({
    collection: "tickets",
    where: { status: { in: ["open", "in_progress"] } },
    limit: 0,
    overrideAccess: true,
  });

  const pendingReview = await payload.find({
    collection: "tickets",
    where: { reviewStatus: { equals: "pending" } },
    limit: 0,
    overrideAccess: true,
  });

  return {
    counts: Object.fromEntries(counts) as Record<string, number>,
    openTickets: openTickets.totalDocs,
    pendingReview: pendingReview.totalDocs,
  };
}

export async function getRecentTickets(limit = 8) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "tickets",
    depth: DEFAULT_DEPTH,
    limit,
    sort: "-reportedAt",
    overrideAccess: true,
  });
  return result.docs;
}

export async function getLocationTree() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "locations",
    depth: 2,
    limit: 200,
    sort: "name",
    overrideAccess: true,
  });
  return result.docs;
}

export type LocationTicketCounts = Record<string, Record<string, number>>;

export async function getLocationTicketCountsByType(
  locationIds: string[]
): Promise<LocationTicketCounts> {
  const counts: LocationTicketCounts = Object.fromEntries(
    locationIds.map((id) => [id, {}])
  );

  if (locationIds.length === 0) {
    return counts;
  }

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "tickets",
    where: { location: { in: locationIds } },
    pagination: false,
    depth: 0,
    select: { location: true, type: true },
    overrideAccess: true,
  });

  for (const ticket of docs) {
    const locationId = String(ticket.location);
    const typeId = String(ticket.type);
    const locationCounts = counts[locationId];
    if (!locationCounts) {
      continue;
    }
    locationCounts[typeId] = (locationCounts[typeId] ?? 0) + 1;
  }

  return counts;
}

export type TeamTicketCounts = Record<string, Record<string, number>>;

export async function getTeamTicketCountsByType(
  teamIds: string[]
): Promise<TeamTicketCounts> {
  const counts: TeamTicketCounts = Object.fromEntries(
    teamIds.map((id) => [id, {}])
  );

  if (teamIds.length === 0) {
    return counts;
  }

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "tickets",
    where: { assignedTeam: { in: teamIds } },
    pagination: false,
    depth: 0,
    select: { assignedTeam: true, type: true },
    overrideAccess: true,
  });

  for (const ticket of docs) {
    const teamId = String(ticket.assignedTeam);
    const typeId = String(ticket.type);
    const teamCounts = counts[teamId];
    if (!teamCounts) {
      continue;
    }
    teamCounts[typeId] = (teamCounts[typeId] ?? 0) + 1;
  }

  return counts;
}
