import { RiToolsLine } from "@remixicon/react";
import type { Where } from "payload";
import { ManufacturingDashboard } from "@/components/app/ManufacturingDashboard";
import { findCollection } from "@/lib/app/queries";
import type { Asset, AssetCategory, Location } from "@/payload-types";

interface PageProps {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

const MACHINE_CATEGORY_MATCHERS = ["machine", "injection"];

function buildMachineAssetWhere(
  categoryIds: string[],
  query: string
): Where | undefined {
  if (categoryIds.length === 0) {
    return {
      id: {
        equals: "__no-machine-assets__",
      },
    };
  }

  const categoryFilter: Where = {
    category: { in: categoryIds },
  };

  if (!query) {
    return categoryFilter;
  }

  return {
    and: [
      categoryFilter,
      {
        or: [{ name: { contains: query } }, { assetTag: { contains: query } }],
      },
    ],
  };
}

type MachineAsset = Asset & {
  machineCode?: string | null;
  currentJobLabel?: string | null;
  moNumber?: string | null;
  targetCycleTimeSec?: number | null;
  actualCycleTimeSec?: number | null;
  oeePercent?: number | null;
  targetOutputPerHour?: number | null;
  actualOutputPerHour?: number | null;
  cycleVariancePercent?: number | null;
  productionVariancePercent?: number | null;
  machineStoppage?: boolean | null;
  stoppageReason?: string | null;
  driftDays?: number | null;
  remainQty?: number | null;
  remainHours?: number | null;
  qtyPerDay?: number | null;
  remainDays?: number | null;
  productionEndDate?: string | null;
  satMon?: boolean | null;
  machineStatus?: "running" | "warning" | "critical" | "stopped" | null;
  lastSnapshotAt?: string | null;
};

function getRelationId(value: string | { id: string }) {
  return typeof value === "string" ? value : value.id;
}

function getRelationName(value: string | { name: string }) {
  return typeof value === "string" ? value : value.name;
}

async function getMachineCategoryIds() {
  const categoryLookups = await Promise.all(
    MACHINE_CATEGORY_MATCHERS.map((term) =>
      findCollection<AssetCategory>("asset-categories", {
        limit: 100,
        page: 1,
        sort: "name",
        where: {
          name: { contains: term },
        },
      })
    )
  );

  return [...new Set(categoryLookups.flatMap((result) => result.docs.map((doc) => doc.id)))];
}

export default async function ManufacturingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const categoryIds = await getMachineCategoryIds();
  const where = buildMachineAssetWhere(categoryIds, query);
  const [machineAssets, locations] = await Promise.all([
    findCollection<MachineAsset>("assets", {
      limit: 500,
      page: 1,
      sort: "name",
      where,
    }),
    findCollection<Location>("locations", {
      limit: 200,
      page: 1,
      sort: "name",
      where: {
        isGroup: { equals: false },
      },
    }),
  ]);

  const dashboardMachines = machineAssets.docs.map((asset) => ({
    id: asset.id,
    name: asset.name,
    assetTag: asset.assetTag,
    machineCode: asset.machineCode,
    currentJobLabel: asset.currentJobLabel,
    moNumber: asset.moNumber,
    targetCycleTimeSec: asset.targetCycleTimeSec,
    actualCycleTimeSec: asset.actualCycleTimeSec,
    oeePercent: asset.oeePercent,
    targetOutputPerHour: asset.targetOutputPerHour,
    actualOutputPerHour: asset.actualOutputPerHour,
    cycleVariancePercent: asset.cycleVariancePercent,
    productionVariancePercent: asset.productionVariancePercent,
    machineStoppage: asset.machineStoppage,
    stoppageReason: asset.stoppageReason,
    driftDays: asset.driftDays,
    remainQty: asset.remainQty,
    remainHours: asset.remainHours,
    qtyPerDay: asset.qtyPerDay,
    remainDays: asset.remainDays,
    productionEndDate: asset.productionEndDate,
    satMon: asset.satMon,
    machineStatus: asset.machineStatus,
    lastSnapshotAt: asset.lastSnapshotAt,
    locationId: getRelationId(asset.location),
    locationName: getRelationName(asset.location),
  }));

  return (
    <div className="space-y-6 px-4 py-4 lg:px-8">
      <div className="flex items-center gap-3">
        <RiToolsLine className="size-5 text-text-sub-600" />
        <div>
          <h1 className="font-semibold text-text-strong-950 text-xl">Manufacturing</h1>
          <p className="text-sm text-text-sub-600">
            Live machine health and production metrics seeded from the workbook.
          </p>
        </div>
      </div>

      <ManufacturingDashboard
        initialQuery={query}
        locations={locations.docs.map((location) => ({
          id: location.id,
          name: location.name,
        }))}
        machines={dashboardMachines}
      />
    </div>
  );
}
