import { relId, relLabel } from "@/lib/app/helpers";
import type { Ticket, TicketType } from "@/payload-types";

export type BreakdownItem = {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
};

export type WeeklyTicketPoint = {
  label: string;
  count: number;
  weekStart: string;
};

export type TicketSummary = {
  id: string;
  ticketNumber: string | null;
  title: string;
  status: Ticket["status"];
  priority: Ticket["priority"];
  typeLabel: string;
  locationLabel: string;
  reportedAt: string;
};

export type ActivitySummary = {
  id: string;
  kind: "comment" | "photo" | "completion" | "review";
  kindLabel: string;
  body: string | null;
  createdAt: string;
  ticketId: string;
  ticketTitle: string;
};

const CHART_COLORS = [
  "#f97316",
  "#84cc16",
  "#14b8a6",
  "#6366f1",
  "#ec4899",
  "#eab308",
] as const;

const STATUS_COLORS: Record<Ticket["status"], string> = {
  open: "#3b82f6",
  in_progress: "#f97316",
  completed: "#22c55e",
  cancelled: "#94a3b8",
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#94a3b8",
};

const ACTIVITY_KIND_LABELS: Record<string, string> = {
  comment: "Comment",
  photo: "Photo",
  completion: "Work completed",
  review: "Review",
};

export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function startOfWeek(date: Date): Date {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

export function weekLabel(date: Date): string {
  const start = startOfWeek(date);
  const oneJan = new Date(start.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((start.getTime() - oneJan.getTime()) / 86_400_000 + oneJan.getDay() + 1) /
      7
  );
  return `Week ${week}`;
}

export function buildBreakdown(
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

export function buildWeeklyTicketSeries(
  tickets: Ticket[],
  filter?: (ticket: Ticket) => boolean,
  getDate?: (ticket: Ticket) => string
): WeeklyTicketPoint[] {
  const now = new Date();
  const weeks: WeeklyTicketPoint[] = [];
  const scoped = filter ? tickets.filter(filter) : tickets;

  for (let i = 6; i >= 0; i--) {
    const anchor = new Date(now);
    anchor.setDate(anchor.getDate() - i * 7);
    const weekStart = startOfWeek(anchor);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = scoped.filter((ticket) => {
      const pointDate = new Date(getDate ? getDate(ticket) : ticket.reportedAt);
      return pointDate >= weekStart && pointDate < weekEnd;
    }).length;

    weeks.push({
      label: weekLabel(anchor),
      count,
      weekStart: weekStart.toISOString(),
    });
  }

  return weeks;
}

export function computeTrendPercent(series: WeeklyTicketPoint[]): number {
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

export function countByStatus(tickets: Ticket[]) {
  return {
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    completed: tickets.filter((t) => t.status === "completed").length,
    cancelled: tickets.filter((t) => t.status === "cancelled").length,
  };
}

export function buildStatusBreakdown(tickets: Ticket[]): BreakdownItem[] {
  const counts = countByStatus(tickets);
  const items = [
    { id: "open", name: "Open", count: counts.open },
    { id: "in_progress", name: "In progress", count: counts.inProgress },
    { id: "completed", name: "Completed", count: counts.completed },
    { id: "cancelled", name: "Cancelled", count: counts.cancelled },
  ].filter((item) => item.count > 0);

  return buildBreakdown(
    items,
    tickets.length,
    (id) => STATUS_COLORS[id as Ticket["status"]] ?? "#94a3b8"
  );
}

export function buildTypeBreakdown(tickets: Ticket[]): BreakdownItem[] {
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

  return buildBreakdown([...typeCounts.values()], tickets.length);
}

export function buildPriorityBreakdown(tickets: Ticket[]): BreakdownItem[] {
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

  return buildBreakdown(
    [...priorityCounts.values()],
    tickets.length,
    (id) => PRIORITY_COLORS[id] ?? "#94a3b8"
  );
}

export function getCompletionHours(ticket: Ticket): number | null {
  if (ticket.status !== "completed") {
    return null;
  }

  const completion = ticket.activity?.find((entry) => entry.kind === "completion");
  const endTime = completion?.createdAt ?? ticket.updatedAt;
  const hours =
    (new Date(endTime).getTime() - new Date(ticket.reportedAt).getTime()) /
    3_600_000;

  return hours >= 0 ? Number(hours.toFixed(1)) : null;
}

export function averageCompletionHours(tickets: Ticket[]): number | null {
  const completed = tickets.filter((t) => t.status === "completed");
  const hours = completed
    .map(getCompletionHours)
    .filter((value): value is number => value != null);

  if (hours.length === 0) {
    return null;
  }

  return Number(
    (hours.reduce((sum, value) => sum + value, 0) / hours.length).toFixed(1)
  );
}

export function formatDurationHours(hours: number | null): string {
  if (hours == null) {
    return "—";
  }
  if (hours < 24) {
    return `${hours}h avg`;
  }
  const days = Math.round(hours / 24);
  return `${days}d avg`;
}

export function toTicketSummary(ticket: Ticket): TicketSummary {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber ?? null,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    typeLabel: relLabel(ticket.type),
    locationLabel: relLabel(ticket.location),
    reportedAt: ticket.reportedAt,
  };
}

export function flattenTicketActivities(
  tickets: Ticket[],
  authorId?: string
): ActivitySummary[] {
  const items: ActivitySummary[] = [];

  for (const ticket of tickets) {
    for (const entry of ticket.activity ?? []) {
      if (authorId && relId(entry.author) !== authorId) {
        continue;
      }

      items.push({
        id: entry.id ?? `${ticket.id}-${entry.createdAt}`,
        kind: entry.kind,
        kindLabel: ACTIVITY_KIND_LABELS[entry.kind] ?? entry.kind,
        body: entry.body ?? null,
        createdAt: entry.createdAt,
        ticketId: ticket.id,
        ticketTitle: ticket.title,
      });
    }
  }

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function topLocationsFromTickets(
  tickets: Ticket[],
  limit = 5
): { id: string; label: string; count: number }[] {
  const counts = new Map<string, { id: string; label: string; count: number }>();

  for (const ticket of tickets) {
    const locationId = relId(ticket.location);
    if (!locationId) {
      continue;
    }
    const label = relLabel(ticket.location);
    const existing = counts.get(locationId);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(locationId, { id: locationId, label, count: 1 });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
