import config from "@payload-config";
import { getPayload } from "payload";
import { relId, relLabel } from "@/lib/app/helpers";
import type {
  BreakdownItem,
  LocationActivityItem,
  LocationOverviewData,
  WeeklyTicketPoint,
} from "@/lib/app/location-overview-types";
import type { Asset, Ticket, TicketType } from "@/payload-types";

export type {
  BreakdownItem,
  LocationActivityItem,
  LocationOverviewData,
  WeeklyTicketPoint,
} from "@/lib/app/location-overview-types";
export { filterActivitiesByPeriod } from "@/lib/app/location-overview-types";

const CHART_COLORS = [
  "#f97316",
  "#84cc16",
  "#14b8a6",
  "#6366f1",
  "#ec4899",
  "#eab308",
] as const;

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#94a3b8",
};

const ACTIVITY_TITLES: Record<string, string> = {
  comment: "Comment added",
  photo: "Photo uploaded",
  completion: "Work completed",
  review: "Review submitted",
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date: Date): Date {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

function weekLabel(date: Date): string {
  const start = startOfWeek(date);
  const oneJan = new Date(start.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((start.getTime() - oneJan.getTime()) / 86_400_000 + oneJan.getDay() + 1) /
      7
  );
  return `Week ${week}`;
}

function buildWeeklyTicketSeries(tickets: Ticket[]): WeeklyTicketPoint[] {
  const now = new Date();
  const weeks: WeeklyTicketPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const anchor = new Date(now);
    anchor.setDate(anchor.getDate() - i * 7);
    const weekStart = startOfWeek(anchor);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = tickets.filter((ticket) => {
      const reportedAt = new Date(ticket.reportedAt);
      return reportedAt >= weekStart && reportedAt < weekEnd;
    }).length;

    weeks.push({
      label: weekLabel(anchor),
      count,
      weekStart: weekStart.toISOString(),
    });
  }

  return weeks;
}

function computeTrendPercent(series: WeeklyTicketPoint[]): number {
  if (series.length < 2) {
    return 0;
  }
  const current = series.at(-1)?.count ?? 0;
  const previous = series.at(-2)?.count ?? 0;
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function buildBreakdown(
  items: { id: string; name: string; count: number }[],
  total: number,
  colorFor?: (id: string, index: number) => string
): BreakdownItem[] {
  if (total === 0) {
    return [];
  }

  return items
    .map((item, index) => ({
      id: item.id,
      name: item.name,
      count: item.count,
      percentage: Number(((item.count / total) * 100).toFixed(0)),
      color:
        colorFor?.(item.id, index) ??
        CHART_COLORS[index % CHART_COLORS.length] ??
        "#f97316",
    }))
    .sort((a, b) => b.count - a.count);
}

function flattenTicketActivities(tickets: Ticket[]): LocationActivityItem[] {
  const items: LocationActivityItem[] = [];

  for (const ticket of tickets) {
    const ticketTitle = ticket.title;
    const entries = ticket.activity ?? [];

    for (const entry of entries) {
      const authorName = relLabel(
        entry.author as Parameters<typeof relLabel>[0]
      );
      const body = entry.body?.trim();
      const description = body
        ? `${ticketTitle}. ${body}`
        : `${ticketTitle}. ${ACTIVITY_TITLES[entry.kind] ?? entry.kind}`;

      items.push({
        id: entry.id ?? `${ticket.id}-${entry.createdAt}`,
        kind: entry.kind,
        title: ACTIVITY_TITLES[entry.kind] ?? entry.kind,
        description,
        timestamp: entry.createdAt,
        ticketId: ticket.id,
        ticketTitle,
        authorName,
      });
    }
  }

  return items.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export async function getLocationOverviewData(
  locationId: string
): Promise<LocationOverviewData> {
  const payload = await getPayload({ config });
  const locationFilter = { location: { equals: locationId } };

  const [ticketsResult, assetsResult] = await Promise.all([
    payload.find({
      collection: "tickets",
      where: locationFilter,
      pagination: false,
      depth: 2,
      sort: "-reportedAt",
      overrideAccess: true,
    }),
    payload.find({
      collection: "assets",
      where: { location: { equals: locationId } },
      pagination: false,
      depth: 1,
      overrideAccess: true,
    }),
  ]);

  const tickets = ticketsResult.docs as Ticket[];
  const assets = assetsResult.docs as Asset[];
  const weeklyTickets = buildWeeklyTicketSeries(tickets);
  const activities = flattenTicketActivities(tickets);

  const todayStart = startOfDay(new Date());
  const activitiesToday = activities.filter(
    (item) => new Date(item.timestamp) >= todayStart
  ).length;

  const statusCounts = new Map<
    string,
    { id: string; name: string; count: number }
  >();
  for (const asset of assets) {
    const statusId = relId(asset.status) ?? "unknown";
    const statusName = relLabel(asset.status, "Unknown");
    const existing = statusCounts.get(statusId);
    if (existing) {
      existing.count += 1;
    } else {
      statusCounts.set(statusId, { id: statusId, name: statusName, count: 1 });
    }
  }

  const assetStatusItems = [...statusCounts.values()];
  const assetStatuses = buildBreakdown(assetStatusItems, assets.length);

  const typeCounts = new Map<
    string,
    { id: string; name: string; count: number }
  >();
  for (const ticket of tickets) {
    const typeId = relId(ticket.type) ?? "unknown";
    const typeName =
      typeof ticket.type === "object"
        ? (ticket.type as TicketType).name
        : relLabel(ticket.type, "Unknown");
    const existing = typeCounts.get(typeId);
    if (existing) {
      existing.count += 1;
    } else {
      typeCounts.set(typeId, { id: typeId, name: typeName, count: 1 });
    }
  }

  const typeItems = [...typeCounts.values()];
  const ticketTypes = buildBreakdown(typeItems, tickets.length);

  const priorityCounts = new Map<
    string,
    { id: string; name: string; count: number }
  >();
  for (const ticket of tickets) {
    const priority = ticket.priority;
    const existing = priorityCounts.get(priority);
    if (existing) {
      existing.count += 1;
    } else {
      priorityCounts.set(priority, {
        id: priority,
        name: priority.charAt(0).toUpperCase() + priority.slice(1),
        count: 1,
      });
    }
  }

  const priorityItems = [...priorityCounts.values()];
  const ticketPriorities = buildBreakdown(
    priorityItems,
    tickets.length,
    (id) => PRIORITY_COLORS[id] ?? "#94a3b8"
  );

  const openOrUrgent = tickets.filter(
    (ticket) =>
      ticket.status === "open" ||
      ticket.status === "in_progress" ||
      ticket.priority === "urgent" ||
      ticket.priority === "high"
  ).length;
  const priorityCoveragePercent =
    tickets.length === 0
      ? 0
      : Number(((openOrUrgent / tickets.length) * 100).toFixed(0));

  return {
    totalTickets: tickets.length,
    ticketTrendPercent: computeTrendPercent(weeklyTickets),
    weeklyTickets,
    assetStatuses,
    topAssetStatus: assetStatuses[0] ?? null,
    ticketTypes,
    ticketPriorities,
    priorityCoveragePercent,
    activities,
    activitiesToday,
  };
}
