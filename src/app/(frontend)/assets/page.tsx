import config from "@payload-config";
import { RiArrowRightSLine, RiSearchLine, RiSettingsLine, RiToolsLine } from "@remixicon/react";
import { getPayload, type Where } from "payload";
import { Suspense } from "react";
import { AssetsListView } from "@/components/app/AssetsListView";
import { DottedRule } from "@/components/app/DottedRule";
import { AssetsInsights } from "@/components/app/PortfolioRouteInsights";
import * as Avatar from "@/components/ui/avatar";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import type { Asset, Ticket } from "@/payload-types";

interface PageProps {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

const PROBLEM_ASSET_STATUS = new Set(["offline", "maintenance", "retired", "damaged"]);

function getRelationId(value: unknown): string | null {
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" ? id : null;
  }
  return typeof value === "string" ? value : null;
}

function getAssetStatusLabel(asset: Asset): string {
  if (typeof asset.status === "object" && asset.status && "name" in asset.status) {
    return String((asset.status as { name?: unknown }).name ?? "Unknown");
  }
  return "Unknown";
}

function getAssetLocationLabel(asset: Asset): string {
  if (
    typeof asset.location === "object" &&
    asset.location &&
    "name" in asset.location
  ) {
    return String((asset.location as { name?: unknown }).name ?? "Unknown");
  }
  return "Unknown";
}

function collectOpenAssetIds(tickets: Ticket[]): Set<string> {
  const assetIdsWithOpenTickets = new Set<string>();
  for (const ticket of tickets) {
    const ticketAssetId = getRelationId(ticket.asset);
    if (ticketAssetId && (ticket.status === "open" || ticket.status === "in_progress")) {
      assetIdsWithOpenTickets.add(ticketAssetId);
    }
  }
  return assetIdsWithOpenTickets;
}

function collectAssetCharts(assets: Asset[]) {
  const statusCounts = new Map<string, number>();
  const openTicketByLocation = new Map<string, number>();

  for (const asset of assets) {
    const statusLabel = getAssetStatusLabel(asset);
    statusCounts.set(statusLabel, (statusCounts.get(statusLabel) ?? 0) + 1);

    const statusId = getRelationId(asset.status) ?? "";
    if (PROBLEM_ASSET_STATUS.has(statusId)) {
      const locationLabel = getAssetLocationLabel(asset);
      openTicketByLocation.set(
        locationLabel,
        (openTicketByLocation.get(locationLabel) ?? 0) + 1
      );
    }
  }

  const byStatus = [...statusCounts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const topProblemLocations = [...openTicketByLocation.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return { byStatus, topProblemLocations };
}

function buildAssetInsights(assets: Asset[], tickets: Ticket[]) {
  const assetIdsWithOpenTickets = collectOpenAssetIds(tickets);
  const { byStatus, topProblemLocations } = collectAssetCharts(assets);

  const stats = [
    { label: "Total assets", value: assets.length },
    {
      label: "Assets with open tickets",
      value: assetIdsWithOpenTickets.size,
      meta: assets.length === 0 ? "0%" : `${Math.round((assetIdsWithOpenTickets.size / assets.length) * 100)}%`,
    },
    {
      label: "Status categories",
      value: byStatus.length,
      meta: byStatus[0] ? `Top: ${byStatus[0].label}` : "No statuses",
    },
    {
      label: "Linked tickets",
      value: tickets.filter((ticket) => getRelationId(ticket.asset)).length,
    },
  ];

  return { byStatus, topProblemLocations, stats };
}

export default async function AssetsPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config });
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const where: Where | undefined = query
    ? {
        or: [{ name: { contains: query } }, { assetTag: { contains: query } }],
      }
    : undefined;

  const [assetsResult, ticketsResult] = await Promise.all([
    payload.find({
      collection: "assets",
      pagination: false,
      depth: 2,
      where,
      overrideAccess: true,
    }),
    payload.find({
      collection: "tickets",
      pagination: false,
      depth: 1,
      overrideAccess: true,
    }),
  ]);

  const assets = assetsResult.docs as Asset[];
  const tickets = ticketsResult.docs as Ticket[];
  const { byStatus, topProblemLocations, stats } = buildAssetInsights(
    assets,
    tickets
  );

  return (
    <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-col">
      <header className="flex min-h-[88px] w-full flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8">
        <div className="flex flex-1 gap-4 lg:gap-3.5">
          <Avatar.Root size="24">
            <RiToolsLine className="size-5 text-text-sub-600" />
          </Avatar.Root>
          <Breadcrumb.Root className="w-fit items-center">
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item active>Assets</Breadcrumb.Item>
          </Breadcrumb.Root>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button.Root mode="ghost" variant="neutral">
            <Button.Icon as={RiSearchLine} />
          </Button.Root>
          <Button.Root mode="ghost" variant="neutral">
            <Button.Icon as={RiSettingsLine} />
          </Button.Root>
        </div>
      </header>

      <div className="px-4 pb-6 lg:px-8">
        <DottedRule />
        <AssetsInsights
          byStatus={byStatus}
          stats={stats}
          topProblemLocations={topProblemLocations}
        />
        <DottedRule />
        <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-bg-weak-50" />}>
          <AssetsListView searchParams={params} where={where} />
        </Suspense>
      </div>
    </div>
  );
}
