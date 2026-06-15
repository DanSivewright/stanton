import type { Route } from "next";
import { relId, relLabel } from "@/lib/mockups/helpers";
import {
  buildPriorityBreakdown,
  buildStatusBreakdown,
  buildTypeBreakdown,
  buildWeeklyTicketSeries,
  computeTrendPercent,
  countByStatus,
  flattenTicketActivities,
  toTicketSummary,
  topLocationsFromTickets,
} from "@/lib/mockups/mr/drawer-stats";
import type { EmployeeDrawerData } from "@/lib/mockups/mr/employee-drawer-types";
import type { TicketDrawerRelation } from "@/lib/mockups/mr/ticket-drawer-types";
import { findById, findCollection } from "@/lib/mockups/queries";
import type { Employee, Ticket } from "@/payload-types";

function relation(
  value: Parameters<typeof relId>[0],
  label: string,
  href?: Route
): TicketDrawerRelation | null {
  const id = relId(value);
  if (!id) {
    return null;
  }
  return { id, label, href };
}

function requireRelation(
  value: Parameters<typeof relId>[0],
  label: string,
  href?: Route
): TicketDrawerRelation {
  return (
    relation(value, label, href) ?? {
      id: "unknown",
      label: label || "—",
      href,
    }
  );
}

export async function getEmployeeDrawerData(
  employeeId: string
): Promise<EmployeeDrawerData | null> {
  const employee = await findById<Employee>("employees", employeeId);
  if (!employee) {
    return null;
  }

  const [assignedResult, reportedResult] = await Promise.all([
    findCollection<Ticket>("tickets", {
      where: { assignedTo: { equals: employeeId } },
      sort: "-reportedAt",
      limit: 100,
    }),
    findCollection<Ticket>("tickets", {
      where: { reportedBy: { equals: employeeId } },
      sort: "-reportedAt",
      limit: 100,
    }),
  ]);

  const assignedTickets = assignedResult.docs;
  const reportedTickets = reportedResult.docs;
  const assignedIds = new Set(assignedTickets.map((ticket) => ticket.id));
  const allTickets = [
    ...assignedTickets,
    ...reportedTickets.filter((ticket) => !assignedIds.has(ticket.id)),
  ];

  const statusCounts = countByStatus(assignedTickets);
  const completionRate =
    assignedTickets.length === 0
      ? 0
      : Number(
          ((statusCounts.completed / assignedTickets.length) * 100).toFixed(0)
        );

  const weeklyTickets = buildWeeklyTicketSeries(assignedTickets);
  const topLocations = topLocationsFromTickets(assignedTickets).map(
    (location) => ({
      ...location,
      href: `/mockups/mr/locations/${location.id}` as Route,
    })
  );

  const companyId = relId(employee.company);
  const teamId = relId(employee.team);

  return {
    employee: {
      id: employee.id,
      fullName: employee.fullName,
      employeeId: employee.employeeId ?? null,
      jobTitle: employee.jobTitle ?? null,
      email: employee.email ?? null,
      phone: employee.phone ?? null,
      company: requireRelation(
        employee.company,
        relLabel(employee.company),
        companyId ? (`/mockups/mr/companies/${companyId}` as Route) : undefined
      ),
      team: relation(
        employee.team,
        relLabel(employee.team),
        teamId && companyId
          ? (`/mockups/mr/companies/${companyId}/maintenance-teams` as Route)
          : undefined
      ),
    },
    stats: {
      assignedTotal: assignedTickets.length,
      reportedTotal: reportedResult.totalDocs,
      open: statusCounts.open,
      inProgress: statusCounts.inProgress,
      completed: statusCounts.completed,
      cancelled: statusCounts.cancelled,
      completionRate,
      ticketTrendPercent: computeTrendPercent(weeklyTickets),
    },
    weeklyTickets,
    statusBreakdown: buildStatusBreakdown(assignedTickets),
    priorityBreakdown: buildPriorityBreakdown(assignedTickets),
    typeBreakdown: buildTypeBreakdown(allTickets),
    topLocations,
    assignedTickets: assignedTickets.slice(0, 8).map(toTicketSummary),
    reportedTickets: reportedTickets.slice(0, 8).map(toTicketSummary),
    recentActivity: flattenTicketActivities(allTickets, employeeId).slice(0, 12),
  };
}
