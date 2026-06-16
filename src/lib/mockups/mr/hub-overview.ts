import config from "@payload-config";
import { getPayload } from "payload";
import { relId, relLabel } from "@/lib/mockups/helpers";
import {
  averageCompletionHours,
  buildBreakdown,
  buildPriorityBreakdown,
  buildStatusBreakdown,
  buildTypeBreakdown,
  buildWeeklyTicketSeries,
  computeTrendPercent,
  toTicketSummary,
} from "@/lib/mockups/mr/drawer-stats";
import type { WeeklyTicketPoint } from "@/lib/mockups/mr/drawer-stats";
import type {
  HubActivityItem,
  HubOverviewData,
  HubRankedEntity,
  HubTeamPerformance,
} from "@/lib/mockups/mr/hub-overview-types";
import { getDashboardStats } from "@/lib/mockups/queries";
import type { Asset, Ticket } from "@/payload-types";

const CHART_COLORS = [
  "#f97316",
  "#84cc16",
  "#14b8a6",
  "#6366f1",
  "#ec4899",
  "#eab308",
] as const;

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

function buildWeeklyCompletionSeries(tickets: Ticket[]): WeeklyTicketPoint[] {
  const now = new Date();
  const weeks: WeeklyTicketPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const anchor = new Date(now);
    anchor.setDate(anchor.getDate() - i * 7);
    const weekStart = startOfWeek(anchor);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = tickets.filter((ticket) => {
      if (ticket.status !== "completed") {
        return false;
      }
      const completion = ticket.activity?.find(
        (entry) => entry.kind === "completion"
      );
      const endTime = completion?.createdAt ?? ticket.updatedAt;
      const completedAt = new Date(endTime);
      return completedAt >= weekStart && completedAt < weekEnd;
    }).length;

    weeks.push({
      label: weekLabel(anchor),
      count,
      weekStart: weekStart.toISOString(),
    });
  }

  return weeks;
}

function flattenHubActivities(tickets: Ticket[]): HubActivityItem[] {
  const items: HubActivityItem[] = [];

  for (const ticket of tickets) {
    const ticketTitle = ticket.title;
    const locationLabel = relLabel(ticket.location);
    const companyLabel = relLabel(ticket.company);

    for (const entry of ticket.activity ?? []) {
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
        locationLabel,
        companyLabel,
      });
    }
  }

  return items.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

function rankEntities(
  tickets: Ticket[],
  getKey: (ticket: Ticket) => { id: string; name: string; meta?: string } | null,
  limit = 5
): HubRankedEntity[] {
  const counts = new Map<
    string,
    { id: string; name: string; count: number; meta?: string }
  >();

  for (const ticket of tickets) {
    const key = getKey(ticket);
    if (!key) {
      continue;
    }
    const existing = counts.get(key.id);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key.id, { ...key, count: 1 });
    }
  }

  const total = tickets.length;
  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      name: item.name,
      count: item.count,
      meta: item.meta,
      percentage:
        total === 0 ? 0 : Number(((item.count / total) * 100).toFixed(0)),
    }));
}

function buildTeamPerformance(tickets: Ticket[], limit = 5): HubTeamPerformance[] {
  const teams = new Map<
    string,
    { id: string; name: string; assigned: number; completed: number }
  >();

  for (const ticket of tickets) {
    const teamId = relId(ticket.assignedTeam);
    if (!teamId) {
      continue;
    }
    const teamName = relLabel(ticket.assignedTeam);
    const existing = teams.get(teamId);
    if (existing) {
      existing.assigned += 1;
      if (ticket.status === "completed") {
        existing.completed += 1;
      }
    } else {
      teams.set(teamId, {
        id: teamId,
        name: teamName,
        assigned: 1,
        completed: ticket.status === "completed" ? 1 : 0,
      });
    }
  }

  return [...teams.values()]
    .sort((a, b) => b.assigned - a.assigned)
    .slice(0, limit)
    .map((team) => ({
      ...team,
      completionRate:
        team.assigned === 0
          ? 0
          : Number(((team.completed / team.assigned) * 100).toFixed(0)),
    }));
}

export async function getHubOverviewData(): Promise<HubOverviewData> {
  const payload = await getPayload({ config });

  const [stats, ticketsResult, assetsResult] = await Promise.all([
    getDashboardStats(),
    payload.find({
      collection: "tickets",
      pagination: false,
      depth: 2,
      sort: "-reportedAt",
      overrideAccess: true,
    }),
    payload.find({
      collection: "assets",
      pagination: false,
      depth: 1,
      overrideAccess: true,
    }),
  ]);

  const tickets = ticketsResult.docs as Ticket[];
  const assets = assetsResult.docs as Asset[];

  const weeklyTickets = buildWeeklyTicketSeries(tickets);
  const weeklyCompletions = buildWeeklyCompletionSeries(tickets);
  const activities = flattenHubActivities(tickets);

  const todayStart = startOfDay(new Date());
  const activitiesToday = activities.filter(
    (item) => new Date(item.timestamp) >= todayStart
  ).length;

  const completedCount = tickets.filter((t) => t.status === "completed").length;
  const completionRate =
    tickets.length === 0
      ? 0
      : Number(((completedCount / tickets.length) * 100).toFixed(0));

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
  const assetStatuses = buildBreakdown(assetStatusItems, assets.length, (_id, index) =>
    CHART_COLORS[index % CHART_COLORS.length] ?? "#f97316"
  );

  const topCompanies = rankEntities(tickets, (ticket) => {
    const id = relId(ticket.company);
    if (!id) {
      return null;
    }
    return { id, name: relLabel(ticket.company) };
  });

  const topLocations = rankEntities(tickets, (ticket) => {
    const id = relId(ticket.location);
    if (!id) {
      return null;
    }
    return {
      id,
      name: relLabel(ticket.location),
      meta: relLabel(ticket.company),
    };
  });

  const topTeams = buildTeamPerformance(tickets);

  return {
    counts: stats.counts,
    openTickets: stats.openTickets,
    pendingReview: stats.pendingReview,
    totalTickets: tickets.length,
    totalAssets: assets.length,
    ticketTrendPercent: computeTrendPercent(weeklyTickets),
    weeklyTickets,
    weeklyCompletions,
    completionRate,
    avgResolutionHours: averageCompletionHours(tickets),
    ticketStatuses: buildStatusBreakdown(tickets),
    ticketTypes: buildTypeBreakdown(tickets),
    ticketPriorities: buildPriorityBreakdown(tickets),
    priorityCoveragePercent,
    assetStatuses,
    topAssetStatus: assetStatuses[0] ?? null,
    topCompanies,
    topLocations,
    topTeams,
    activities,
    activitiesToday,
    recentTickets: tickets.slice(0, 8).map(toTicketSummary),
  };
}
