import config from "@payload-config";
import { RiArrowRightSLine, RiSearchLine, RiSettingsLine, RiTeamLine } from "@remixicon/react";
import { getPayload, type Where } from "payload";
import { Suspense } from "react";
import { DottedRule } from "@/components/app/DottedRule";
import { MaintenanceTeamsListView } from "@/components/app/MaintenanceTeamsListView";
import { MaintenanceTeamsInsights } from "@/components/app/PortfolioRouteInsights";
import * as Avatar from "@/components/ui/avatar";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import type { MaintenanceTeam, Ticket } from "@/payload-types";

interface PageProps {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

function getRelationLabel(value: unknown, fallback: string): string {
  if (value && typeof value === "object" && "fullName" in value) {
    const fullName = (value as { fullName?: unknown }).fullName;
    if (typeof fullName === "string" && fullName.trim()) {
      return fullName;
    }
  }
  if (value && typeof value === "object" && "name" in value) {
    const name = (value as { name?: unknown }).name;
    if (typeof name === "string" && name.trim()) {
      return name;
    }
  }
  return fallback;
}

function getRelationId(value: unknown): string | null {
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" ? id : null;
  }
  return typeof value === "string" ? value : null;
}

export default async function MaintenanceTeamsPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config });
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const where: Where | undefined = query
    ? {
        name: { contains: query },
      }
    : undefined;

  const [teamsResult, ticketsResult] = await Promise.all([
    payload.find({
      collection: "maintenance-teams",
      pagination: false,
      depth: 1,
      where,
      overrideAccess: true,
    }),
    payload.find({
      collection: "tickets",
      pagination: false,
      depth: 2,
      overrideAccess: true,
    }),
  ]);

  const teams = teamsResult.docs as MaintenanceTeam[];
  const tickets = ticketsResult.docs as Ticket[];

  const peopleBreakdown = new Map<
    string,
    { label: string; open: number; closed: number; review: number; problems: number }
  >();
  const teamOpenCounts = new Map<string, number>();

  for (const ticket of tickets) {
    const assigneeId = getRelationId(ticket.assignedTo) ?? "unassigned";
    const assigneeLabel = getRelationLabel(ticket.assignedTo, "Unassigned");
    const existingAssignee = peopleBreakdown.get(assigneeId) ?? {
      label: assigneeLabel,
      open: 0,
      closed: 0,
      review: 0,
      problems: 0,
    };

    if (ticket.status === "completed") {
      existingAssignee.closed += 1;
    } else {
      existingAssignee.open += 1;
    }

    if (ticket.reviewStatus === "pending") {
      existingAssignee.review += 1;
    }

    if (ticket.priority === "high" || ticket.priority === "urgent") {
      existingAssignee.problems += 1;
    }

    peopleBreakdown.set(assigneeId, existingAssignee);

    const teamId = getRelationId(ticket.assignedTeam);
    const teamName = getRelationLabel(ticket.assignedTeam, "Unassigned Team");
    if (teamId && (ticket.status === "open" || ticket.status === "in_progress")) {
      teamOpenCounts.set(teamName, (teamOpenCounts.get(teamName) ?? 0) + 1);
    }
  }

  const byPerson = [...peopleBreakdown.values()]
    .sort(
      (a, b) =>
        b.open + b.problems + b.review + b.closed - (a.open + a.problems + a.review + a.closed)
    )
    .slice(0, 8);

  const byTeamOpen = [...teamOpenCounts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const totalMembers = teams.reduce(
    (sum, team) => sum + (team.members?.length ?? 0),
    0
  );
  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open" || ticket.status === "in_progress"
  ).length;
  const closedTickets = tickets.filter((ticket) => ticket.status === "completed").length;
  const pendingReview = tickets.filter(
    (ticket) => ticket.reviewStatus === "pending"
  ).length;

  const stats = [
    {
      label: "Maintenance teams",
      value: teams.length,
      meta: `${totalMembers} members total`,
    },
    { label: "Open tickets assigned", value: openTickets },
    { label: "Closed tickets", value: closedTickets },
    { label: "Needs review", value: pendingReview },
  ];

  return (
    <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-col">
      <header className="flex min-h-[88px] w-full flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8">
        <div className="flex flex-1 gap-4 lg:gap-3.5">
          <Avatar.Root size="24">
            <RiTeamLine className="size-5 text-text-sub-600" />
          </Avatar.Root>
          <Breadcrumb.Root className="w-fit items-center">
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item active>Maintenance Teams</Breadcrumb.Item>
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
        <MaintenanceTeamsInsights byPerson={byPerson} byTeamOpen={byTeamOpen} stats={stats} />
        <DottedRule />
        <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-bg-weak-50" />}>
          <MaintenanceTeamsListView searchParams={params} where={where} />
        </Suspense>
      </div>
    </div>
  );
}
