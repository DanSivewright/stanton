export type WeeklyTicketPoint = {
  label: string;
  count: number;
  weekStart: string;
};

export type BreakdownItem = {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
};

export type LocationActivityItem = {
  id: string;
  kind: "comment" | "photo" | "completion" | "review";
  title: string;
  description: string;
  timestamp: string;
  ticketId: string;
  ticketTitle: string;
  authorName: string;
};

export type LocationOverviewData = {
  totalTickets: number;
  ticketTrendPercent: number;
  weeklyTickets: WeeklyTicketPoint[];
  assetStatuses: BreakdownItem[];
  topAssetStatus: BreakdownItem | null;
  ticketTypes: BreakdownItem[];
  ticketPriorities: BreakdownItem[];
  priorityCoveragePercent: number;
  activities: LocationActivityItem[];
  activitiesToday: number;
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function filterActivitiesByPeriod(
  activities: LocationActivityItem[],
  period: "today" | "yesterday" | "week"
): LocationActivityItem[] {
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
