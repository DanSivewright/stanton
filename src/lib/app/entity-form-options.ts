import config from "@payload-config";
import { getPayload } from "payload";

export type FormOption = {
  label: string;
  value: string;
};

export type EntityFormOptions = {
  assets: FormOption[];
  companies: FormOption[];
  locations: FormOption[];
  employees: FormOption[];
  maintenanceTeams: FormOption[];
  ticketTypes: FormOption[];
  assetCategories: FormOption[];
  assetStatuses: FormOption[];
};

function mapOptions(
  docs: Array<{ id: string; name?: string | null; fullName?: string | null }>
): FormOption[] {
  return docs.map((doc) => ({
    value: doc.id,
    label: doc.name || doc.fullName || doc.id,
  }));
}

export async function getEntityFormOptions(): Promise<EntityFormOptions> {
  const payload = await getPayload({ config });

  const [
    companiesResult,
    assetsResult,
    locationsResult,
    employeesResult,
    teamsResult,
    ticketTypesResult,
    categoriesResult,
    statusesResult,
  ] = await Promise.all([
    payload.find({
      collection: "companies",
      depth: 0,
      limit: 500,
      sort: "name",
      select: { id: true, name: true },
      overrideAccess: true,
    }),
    payload.find({
      collection: "assets",
      depth: 0,
      limit: 1000,
      sort: "name",
      select: { id: true, name: true },
      overrideAccess: true,
    }),
    payload.find({
      collection: "locations",
      depth: 0,
      limit: 1000,
      sort: "name",
      where: { isGroup: { equals: false } },
      select: { id: true, name: true },
      overrideAccess: true,
    }),
    payload.find({
      collection: "employees",
      depth: 0,
      limit: 1000,
      sort: "fullName",
      select: { id: true, fullName: true },
      overrideAccess: true,
    }),
    payload.find({
      collection: "maintenance-teams",
      depth: 0,
      limit: 500,
      sort: "name",
      select: { id: true, name: true },
      overrideAccess: true,
    }),
    payload.find({
      collection: "ticket-types",
      depth: 0,
      limit: 200,
      sort: "name",
      select: { id: true, name: true },
      overrideAccess: true,
    }),
    payload.find({
      collection: "asset-categories",
      depth: 0,
      limit: 200,
      sort: "name",
      select: { id: true, name: true },
      overrideAccess: true,
    }),
    payload.find({
      collection: "asset-statuses",
      depth: 0,
      limit: 200,
      sort: "name",
      select: { id: true, name: true },
      overrideAccess: true,
    }),
  ]);

  return {
    assets: mapOptions(assetsResult.docs),
    companies: mapOptions(companiesResult.docs),
    locations: mapOptions(locationsResult.docs),
    employees: mapOptions(employeesResult.docs),
    maintenanceTeams: mapOptions(teamsResult.docs),
    ticketTypes: mapOptions(ticketTypesResult.docs),
    assetCategories: mapOptions(categoriesResult.docs),
    assetStatuses: mapOptions(statusesResult.docs),
  };
}
