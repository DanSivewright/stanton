"use client";

import {
  RiArrowRightSLine,
  RiBuilding2Line,
  RiCheckboxCircleLine,
  RiTicketLine,
  RiUserLine,
} from "@remixicon/react";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TicketStatusBadge } from "@/components/mockups/mr/TicketStatusBadge";
import * as Avatar from "@/components/ui/avatar";
import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as CompactButton from "@/components/ui/compact-button";
import * as Divider from "@/components/ui/divider";
import * as Drawer from "@/components/ui/drawer";
import * as ProgressCircle from "@/components/ui/progress-circle";
import * as StatusBadge from "@/components/ui/status-badge";
import * as TabMenu from "@/components/ui/tab-menu-horizontal";
import { formatDate, initials } from "@/lib/mockups/helpers";
import type { BreakdownItem, TicketSummary } from "@/lib/mockups/mr/drawer-stats";
import type { TeamDrawerData } from "@/lib/mockups/mr/team-drawer-types";
import type { MaintenanceTeam } from "@/payload-types";

interface MaintenanceTeamDetailDrawerProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  teamId: string | null;
}

function StatCard({
  accent,
  label,
  value,
}: {
  accent?: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200 ring-inset">
      <div className="text-subheading-xs text-text-soft-400 uppercase">
        {label}
      </div>
      <div
        className="mt-1 text-label-md text-text-strong-950"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function SegmentedBar({ percentage, color }: { percentage: number; color: string }) {
  const segments = 24;
  const filled = Math.round((percentage / 100) * segments);

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: segments }, (_, index) => (
        <div
          className="h-6 flex-1 rounded-sm"
          key={index}
          style={{
            backgroundColor:
              index < filled ? color : "var(--color-bg-soft-200, #e2e4e9)",
          }}
        />
      ))}
    </div>
  );
}

function MiniPieChart({ data }: { data: BreakdownItem[] }) {
  if (data.length === 0) {
    return (
      <p className="py-6 text-center text-paragraph-xs text-text-soft-400">
        No tickets yet
      </p>
    );
  }

  return (
    <ResponsiveContainer height={120} width="100%">
      <PieChart>
        <Pie
          cx="50%"
          cy="50%"
          data={data}
          dataKey="count"
          innerRadius={32}
          nameKey="name"
          outerRadius={52}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell fill={entry.color} key={entry.id} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid var(--color-stroke-soft-200)",
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TypeBarChart({ data }: { data: BreakdownItem[] }) {
  if (data.length === 0) {
    return (
      <p className="py-6 text-center text-paragraph-xs text-text-soft-400">
        No ticket types recorded
      </p>
    );
  }

  return (
    <ResponsiveContainer height={140} width="100%">
      <BarChart data={data.slice(0, 6)}>
        <XAxis
          axisLine={false}
          dataKey="name"
          tick={{ fontSize: 10, fill: "var(--color-text-sub-600)" }}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid var(--color-stroke-soft-200)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.slice(0, 6).map((entry) => (
            <Cell fill={entry.color} key={entry.id} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function TicketRow({ ticket }: { ticket: TicketSummary }) {
  return (
    <div className="flex items-start gap-3 rounded-xl py-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning-lighter">
        <RiTicketLine className="size-4 text-warning-base" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="truncate text-label-sm text-text-strong-950">
          {ticket.title}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-paragraph-xs text-text-sub-600">
            {ticket.ticketNumber ?? "—"}
          </span>
          <TicketStatusBadge status={ticket.status} />
        </div>
        <div className="truncate text-paragraph-xs text-text-soft-400">
          {ticket.locationLabel} · {ticket.typeLabel}
        </div>
      </div>
      <div className="shrink-0 text-paragraph-xs text-text-sub-600">
        {formatDate(ticket.reportedAt)}
      </div>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-4 p-5">
      <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-bg-weak-50" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 animate-pulse rounded-xl bg-bg-weak-50" />
        <div className="h-16 animate-pulse rounded-xl bg-bg-weak-50" />
      </div>
      <div className="h-32 animate-pulse rounded-xl bg-bg-weak-50" />
    </div>
  );
}

function TeamDrawerContent({ data }: { data: TeamDrawerData }) {
  const { team, performance } = data;
  const trendPositive = performance.ticketTrendPercent >= 0;
  const openTotal = performance.open + performance.inProgress;

  return (
    <TabMenu.Root defaultValue="performance">
      <div className="flex flex-col items-center gap-4 border-stroke-soft-200 border-b px-5 py-6">
        <ProgressCircle.Root size="72" value={performance.completionRate}>
          <Avatar.Root color="purple" placeholderType="company" size="48" />
        </ProgressCircle.Root>
        <div className="space-y-1 text-center">
          <div className="text-label-lg text-text-strong-950">{team.name}</div>
          <div className="text-paragraph-sm text-text-sub-600">
            {team.memberCount} member{team.memberCount === 1 ? "" : "s"} ·{" "}
            {performance.totalTickets} tickets
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge.Root color="blue" size="small" variant="lighter">
            {openTotal} open
          </Badge.Root>
          <Badge.Root color="green" size="small" variant="lighter">
            {performance.completed} closed
          </Badge.Root>
          <StatusBadge.Root
            status={trendPositive ? "completed" : "failed"}
            variant="light"
          >
            <StatusBadge.Dot />
            {trendPositive ? "+" : ""}
            {performance.ticketTrendPercent}% completions
          </StatusBadge.Root>
        </div>
      </div>

      <TabMenu.List className="px-5">
        <TabMenu.Trigger value="performance">
          <TabMenu.Icon as={RiCheckboxCircleLine} />
          Performance
        </TabMenu.Trigger>
        <TabMenu.Trigger value="tickets">
          <TabMenu.Icon as={RiTicketLine} />
          Tickets
        </TabMenu.Trigger>
        <TabMenu.Trigger value="members">
          <TabMenu.Icon as={RiUserLine} />
          Members
        </TabMenu.Trigger>
      </TabMenu.List>

      <TabMenu.Content value="performance">
        <div className="grid grid-cols-2 gap-3 p-5">
          <StatCard
            accent="#22c55e"
            label="Completion rate"
            value={`${performance.completionRate}%`}
          />
          <StatCard
            accent="#6366f1"
            label="Avg resolution"
            value={performance.avgResolutionLabel}
          />
          <StatCard label="Open" value={performance.open} />
          <StatCard label="In progress" value={performance.inProgress} />
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Completion progress
        </Divider.Root>
        <div className="space-y-2 p-5">
          <div className="flex items-center justify-between text-paragraph-xs">
            <span className="text-text-sub-600">Team completion rate</span>
            <span className="text-label-xs text-text-strong-950">
              {performance.completionRate}%
            </span>
          </div>
          <SegmentedBar color="#22c55e" percentage={performance.completionRate} />
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Weekly completions
        </Divider.Root>
        <div className="px-5 py-4">
          {performance.weeklyCompletions.every((point) => point.count === 0) ? (
            <p className="py-4 text-center text-paragraph-xs text-text-soft-400">
              No completions this period
            </p>
          ) : (
            <ResponsiveContainer height={100} width="100%">
              <AreaChart data={performance.weeklyCompletions}>
                <defs>
                  <linearGradient id="teamWeeklyFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-stroke-soft-200)",
                    fontSize: 12,
                  }}
                />
                <Area
                  dataKey="count"
                  fill="url(#teamWeeklyFill)"
                  stroke="#22c55e"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Status distribution
        </Divider.Root>
        <div className="grid grid-cols-2 gap-4 p-5">
          <MiniPieChart data={data.statusBreakdown} />
          <div className="space-y-2">
            {data.statusBreakdown.map((item) => (
              <div
                className="flex items-center justify-between gap-2"
                key={item.id}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-paragraph-xs text-text-sub-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-label-xs text-text-strong-950">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Ticket types
        </Divider.Root>
        <div className="px-5 py-4">
          <TypeBarChart data={data.typeBreakdown} />
        </div>
      </TabMenu.Content>

      <TabMenu.Content value="tickets">
        <Divider.Root className="px-5" variant="solid-text">
          Recent team tickets
        </Divider.Root>
        <div className="space-y-1 px-5 py-3">
          {data.recentTickets.length === 0 ? (
            <p className="py-6 text-center text-paragraph-sm text-text-soft-400">
              No tickets assigned to this team.
            </p>
          ) : (
            data.recentTickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>

        {data.priorityBreakdown.length > 0 ? (
          <>
            <Divider.Root className="px-5" variant="solid-text">
              Priority workload
            </Divider.Root>
            <div className="space-y-2 p-5">
              {data.priorityBreakdown.map((item) => (
                <div className="space-y-1" key={item.id}>
                  <div className="flex items-center justify-between text-paragraph-xs">
                    <span className="text-text-sub-600 capitalize">
                      {item.name}
                    </span>
                    <span className="text-label-xs text-text-strong-950">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-bg-soft-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </TabMenu.Content>

      <TabMenu.Content value="members">
        <Divider.Root className="px-5" variant="solid-text">
          Team roster
        </Divider.Root>
        <div className="space-y-2 p-5">
          {data.members.length === 0 ? (
            <p className="py-6 text-center text-paragraph-sm text-text-soft-400">
              No members on this team.
            </p>
          ) : (
            data.members.map((member) => (
              <div
                className="flex items-center gap-3 rounded-xl bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200 ring-inset"
                key={member.id}
              >
                <Avatar.Root color="blue" size="40">
                  {initials(member.fullName)}
                </Avatar.Root>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-label-sm text-text-strong-950">
                    {member.fullName}
                  </div>
                  <div className="truncate text-paragraph-xs text-text-sub-600">
                    {member.jobTitle ?? member.email ?? "Team member"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Type coverage
        </Divider.Root>
        <div className="flex flex-wrap gap-2 p-5">
          {data.typeBreakdown.length === 0 ? (
            <p className="text-paragraph-sm text-text-soft-400">
              No ticket type data.
            </p>
          ) : (
            data.typeBreakdown.map((item) => (
              <Badge.Root color="gray" key={item.id} size="small" variant="lighter">
                {item.name} · {item.count}
              </Badge.Root>
            ))
          )}
        </div>
      </TabMenu.Content>
    </TabMenu.Root>
  );
}

export function MaintenanceTeamDetailDrawer({
  onOpenChange,
  open,
  teamId,
}: MaintenanceTeamDetailDrawerProps) {
  const [data, setData] = useState<TeamDrawerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!teamId) {
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(
      `/mockups/mr/maintenance-teams/${encodeURIComponent(teamId)}/drawer`,
      { signal: controller.signal }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load team details.");
        }
        return response.json() as Promise<TeamDrawerData>;
      })
      .then((next) => {
        setData(next);
      })
      .catch((fetchError: unknown) => {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }
        setError("Could not load team details.");
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [open, teamId]);

  return (
    <Drawer.Root onOpenChange={onOpenChange} open={open}>
      <Drawer.Content className="max-w-[480px]">
        <Drawer.Header className="border-stroke-soft-200 border-b">
          <Drawer.Title>Team performance</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          {loading ? <DrawerSkeleton /> : null}
          {!loading && error ? (
            <p className="p-5 text-error-base text-paragraph-sm">{error}</p>
          ) : null}
          {!loading && data ? <TeamDrawerContent data={data} /> : null}
        </Drawer.Body>
        {data ? (
          <Drawer.Footer className="border-stroke-soft-200 border-t">
            {data.team.company.href ? (
              <Button.Root
                asChild
                className="w-full"
                mode="stroke"
                size="medium"
                variant="neutral"
              >
                <Link href={data.team.company.href as Route}>
                  <Button.Icon as={RiBuilding2Line} />
                  View company
                </Link>
              </Button.Root>
            ) : null}
          </Drawer.Footer>
        ) : null}
      </Drawer.Content>
    </Drawer.Root>
  );
}

export function TeamRowTrigger({
  onOpen,
  team,
}: {
  onOpen: () => void;
  team: Pick<MaintenanceTeam, "name">;
}) {
  return (
    <button
      className="group flex min-w-0 items-center gap-3 text-left transition duration-200 ease-out hover:opacity-80"
      onClick={onOpen}
      type="button"
    >
      <Avatar.Root placeholderType="company" size="40" />
      <div className="min-w-0 flex-1 truncate font-medium text-text-strong-950 group-hover:text-primary-base">
        {team.name}
      </div>
      <CompactButton.Root
        className="shrink-0 opacity-0 transition group-hover:opacity-100"
        size="medium"
        variant="ghost"
      >
        <CompactButton.Icon as={RiArrowRightSLine} />
      </CompactButton.Root>
    </button>
  );
}
