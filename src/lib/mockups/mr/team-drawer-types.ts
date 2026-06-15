import type { Route } from "next";
import type { TicketDrawerRelation } from "@/lib/mockups/mr/ticket-drawer-types";
import type {
  BreakdownItem,
  TicketSummary,
  WeeklyTicketPoint,
} from "@/lib/mockups/mr/drawer-stats";
import type { MaintenanceTeam, Ticket } from "@/payload-types";

export interface TeamMemberSummary {
  id: string;
  fullName: string;
  jobTitle: string | null;
  email: string | null;
}

export interface TeamDrawerData {
  team: {
    id: string;
    name: string;
    memberCount: number;
    company: TicketDrawerRelation;
  };
  members: TeamMemberSummary[];
  performance: {
    totalTickets: number;
    open: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    completionRate: number;
    avgResolutionHours: number | null;
    avgResolutionLabel: string;
    ticketTrendPercent: number;
    weeklyCompletions: WeeklyTicketPoint[];
  };
  statusBreakdown: BreakdownItem[];
  typeBreakdown: BreakdownItem[];
  priorityBreakdown: BreakdownItem[];
  recentTickets: TicketSummary[];
}

export type { TicketDrawerRelation };
