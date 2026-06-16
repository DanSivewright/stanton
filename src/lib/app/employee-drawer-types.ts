import type { Route } from "next";
import type { TicketDrawerRelation } from "@/lib/app/ticket-drawer-types";
import type {
  ActivitySummary,
  BreakdownItem,
  TicketSummary,
  WeeklyTicketPoint,
} from "@/lib/app/drawer-stats";
import type { Employee, Ticket } from "@/payload-types";

export interface EmployeeDrawerData {
  employee: {
    id: string;
    fullName: string;
    employeeId: string | null;
    jobTitle: string | null;
    email: string | null;
    phone: string | null;
    company: TicketDrawerRelation;
    team: TicketDrawerRelation | null;
  };
  stats: {
    assignedTotal: number;
    reportedTotal: number;
    open: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    completionRate: number;
    ticketTrendPercent: number;
  };
  weeklyTickets: WeeklyTicketPoint[];
  statusBreakdown: BreakdownItem[];
  priorityBreakdown: BreakdownItem[];
  typeBreakdown: BreakdownItem[];
  topLocations: { id: string; label: string; count: number; href: Route }[];
  assignedTickets: TicketSummary[];
  reportedTickets: TicketSummary[];
  recentActivity: ActivitySummary[];
}

export type { TicketDrawerRelation };
