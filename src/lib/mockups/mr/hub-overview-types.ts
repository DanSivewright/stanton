import type {
  BreakdownItem,
  TicketSummary,
  WeeklyTicketPoint,
} from "@/lib/mockups/mr/drawer-stats";

export type HubActivityItem = {
  id: string;
  kind: "comment" | "photo" | "completion" | "review";
  title: string;
  description: string;
  timestamp: string;
  ticketId: string;
  ticketTitle: string;
  authorName: string;
  locationLabel: string;
  companyLabel: string;
};

export type HubRankedEntity = {
  id: string;
  name: string;
  count: number;
  meta?: string;
  percentage?: number;
};

export type HubTeamPerformance = {
  id: string;
  name: string;
  assigned: number;
  completed: number;
  completionRate: number;
};

export type HubOverviewData = {
  counts: Record<string, number>;
  openTickets: number;
  pendingReview: number;
  totalTickets: number;
  totalAssets: number;
  ticketTrendPercent: number;
  weeklyTickets: WeeklyTicketPoint[];
  weeklyCompletions: WeeklyTicketPoint[];
  completionRate: number;
  avgResolutionHours: number | null;
  ticketStatuses: BreakdownItem[];
  ticketTypes: BreakdownItem[];
  ticketPriorities: BreakdownItem[];
  priorityCoveragePercent: number;
  assetStatuses: BreakdownItem[];
  topAssetStatus: BreakdownItem | null;
  topCompanies: HubRankedEntity[];
  topLocations: HubRankedEntity[];
  topTeams: HubTeamPerformance[];
  activities: HubActivityItem[];
  activitiesToday: number;
  recentTickets: TicketSummary[];
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function filterHubActivitiesByPeriod(
  activities: HubActivityItem[],
  period: "today" | "yesterday" | "week"
): HubActivityItem[] {
  const now = new Date();
  const today = startOfDay(now);

  if (period === "today") {
    return activities.filter((item) => new Date(item.timestamp) >= today);
  }

  if (period === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return activities.filter((item) => {
      const ts = new Date(item.timestamp);
      return ts >= yesterday && ts < today;
    });
  }

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 7);
  return activities.filter((item) => new Date(item.timestamp) >= weekStart);
}
