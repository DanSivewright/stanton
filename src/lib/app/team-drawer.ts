import type { Route } from "next";
import { relId, relLabel } from "@/lib/app/helpers";
import {
  averageCompletionHours,
  buildPriorityBreakdown,
  buildStatusBreakdown,
  buildTypeBreakdown,
  buildWeeklyTicketSeries,
  computeTrendPercent,
  countByStatus,
  formatDurationHours,
  toTicketSummary,
} from "@/lib/app/drawer-stats";
import type {
  TeamDrawerData,
  TeamMemberSummary,
} from "@/lib/app/team-drawer-types";
import type { TicketDrawerRelation } from "@/lib/app/ticket-drawer-types";
import { findById, findCollection } from "@/lib/app/queries";
import type { Employee, MaintenanceTeam, Ticket } from "@/payload-types";

function requireRelation(
  value: Parameters<typeof relId>[0],
  label: string,
  href?: Route
): TicketDrawerRelation {
  const id = relId(value);
  return {
    id: id ?? "unknown",
    label: label || "—",
    href,
  };
}

function toMemberSummary(member: Employee | string): TeamMemberSummary | null {
  if (typeof member === "string") {
    return null;
  }
  return {
    id: member.id,
    fullName: member.fullName,
    jobTitle: member.jobTitle ?? null,
    email: member.email ?? null,
  };
}

export async function getTeamDrawerData(
  teamId: string
): Promise<TeamDrawerData | null> {
  const team = await findById<MaintenanceTeam>("maintenance-teams", teamId);
  if (!team) {
    return null;
  }

  const ticketsResult = await findCollection<Ticket>("tickets", {
    where: { assignedTeam: { equals: teamId } },
    sort: "-reportedAt",
    limit: 200,
  });

  const tickets = ticketsResult.docs;
  const statusCounts = countByStatus(tickets);
  const avgResolutionHours = averageCompletionHours(tickets);
  const completionRate =
    tickets.length === 0
      ? 0
      : Number(((statusCounts.completed / tickets.length) * 100).toFixed(0));

  const weeklyCompletions = buildWeeklyTicketSeries(
    tickets,
    (ticket) => ticket.status === "completed"
  );

  const members = (team.members ?? [])
    .map((member) => toMemberSummary(member as Employee | string))
    .filter((member): member is TeamMemberSummary => member != null);

  const companyId = relId(team.company);

  return {
    team: {
      id: team.id,
      name: team.name,
      memberCount: members.length,
      company: requireRelation(
        team.company,
        relLabel(team.company),
        companyId ? (`/companies/${companyId}` as Route) : undefined
      ),
    },
    members,
    performance: {
      totalTickets: tickets.length,
      open: statusCounts.open,
      inProgress: statusCounts.inProgress,
      completed: statusCounts.completed,
      cancelled: statusCounts.cancelled,
      completionRate,
      avgResolutionHours,
      avgResolutionLabel: formatDurationHours(avgResolutionHours),
      ticketTrendPercent: computeTrendPercent(weeklyCompletions),
      weeklyCompletions,
    },
    statusBreakdown: buildStatusBreakdown(tickets),
    typeBreakdown: buildTypeBreakdown(tickets),
    priorityBreakdown: buildPriorityBreakdown(tickets),
    recentTickets: tickets.slice(0, 10).map(toTicketSummary),
  };
}
