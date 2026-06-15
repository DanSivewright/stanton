"use client";

import {
  RiArrowRightSLine,
  RiBuilding2Line,
  RiChat3Line,
  RiCheckboxCircleLine,
  RiEyeLine,
  RiImageLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiTeamLine,
  RiTicketLine,
  RiUserLine,
} from "@remixicon/react";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
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
import {
  formatDate,
  formatDateTime,
  initials,
} from "@/lib/mockups/helpers";
import type {
  ActivitySummary,
  BreakdownItem,
  TicketSummary,
} from "@/lib/mockups/mr/drawer-stats";
import type { EmployeeDrawerData } from "@/lib/mockups/mr/employee-drawer-types";
import type { Employee } from "@/payload-types";

const ACTIVITY_ICONS = {
  comment: RiChat3Line,
  photo: RiImageLine,
  completion: RiCheckboxCircleLine,
  review: RiEyeLine,
} as const;

interface EmployeeDetailDrawerProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  employeeId: string | null;
}

function StatCard({
  label,
  sublabel,
  value,
}: {
  label: string;
  sublabel?: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200 ring-inset">
      <div className="text-subheading-xs text-text-soft-400 uppercase">
        {label}
      </div>
      <div className="mt-1 text-label-md text-text-strong-950">{value}</div>
      {sublabel ? (
        <div className="mt-0.5 text-paragraph-xs text-text-sub-600">
          {sublabel}
        </div>
      ) : null}
    </div>
  );
}

function MiniPieChart({ data }: { data: BreakdownItem[] }) {
  if (data.length === 0) {
    return (
      <p className="py-6 text-center text-paragraph-xs text-text-soft-400">
        No data yet
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
          formatter={(value, name) => [`${value ?? 0}`, String(name)]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function WeeklyChart({
  data,
  color = "#6366f1",
}: {
  data: EmployeeDrawerData["weeklyTickets"];
  color?: string;
}) {
  if (data.every((point) => point.count === 0)) {
    return (
      <p className="py-6 text-center text-paragraph-xs text-text-soft-400">
        No ticket activity this period
      </p>
    );
  }

  return (
    <ResponsiveContainer height={100} width="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="employeeWeeklyFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid var(--color-stroke-soft-200)",
            fontSize: 12,
          }}
          formatter={(value) => [`${value ?? 0} tickets`, "Assigned"]}
          labelFormatter={(label) => String(label)}
        />
        <Area
          dataKey="count"
          fill="url(#employeeWeeklyFill)"
          stroke={color}
          strokeWidth={2}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BreakdownLegend({ items }: { items: BreakdownItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div className="flex items-center justify-between gap-2" key={item.id}>
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate text-paragraph-xs text-text-sub-600">
              {item.name}
            </span>
          </div>
          <span className="shrink-0 text-label-xs text-text-strong-950">
            {item.count}
            <span className="ml-1 text-text-soft-400">({item.percentage}%)</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function TicketRow({ ticket }: { ticket: TicketSummary }) {
  return (
    <div className="flex items-start gap-3 rounded-xl py-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-information-lighter">
        <RiTicketLine className="size-4 text-information-base" />
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

function ActivityRow({ entry }: { entry: ActivitySummary }) {
  const Icon = ACTIVITY_ICONS[entry.kind] ?? RiChat3Line;

  return (
    <div className="flex items-start gap-3 rounded-xl py-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-feature-lighter">
        <Icon className="size-4 text-feature-base" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-label-sm text-text-strong-950">
            {entry.ticketTitle}
          </span>
          <Badge.Root color="purple" size="small" variant="lighter">
            {entry.kindLabel}
          </Badge.Root>
        </div>
        {entry.body ? (
          <p className="line-clamp-2 text-paragraph-xs text-text-sub-600">
            {entry.body}
          </p>
        ) : null}
      </div>
      <div className="shrink-0 text-paragraph-xs text-text-sub-600">
        {formatDateTime(entry.createdAt)}
      </div>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-4 p-5">
      <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-bg-weak-50" />
      <div className="mx-auto h-5 w-48 animate-pulse rounded bg-bg-weak-50" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 animate-pulse rounded-xl bg-bg-weak-50" />
        <div className="h-16 animate-pulse rounded-xl bg-bg-weak-50" />
      </div>
      <div className="h-32 animate-pulse rounded-xl bg-bg-weak-50" />
    </div>
  );
}

function EmployeeDrawerContent({ data }: { data: EmployeeDrawerData }) {
  const { employee, stats } = data;
  const trendPositive = stats.ticketTrendPercent >= 0;

  return (
    <TabMenu.Root defaultValue="overview">
      <div className="flex flex-col items-center gap-4 border-stroke-soft-200 border-b px-5 py-6">
        <ProgressCircle.Root size="72" value={stats.completionRate}>
          <Avatar.Root color="blue" size="48">
            {initials(employee.fullName)}
          </Avatar.Root>
        </ProgressCircle.Root>
        <div className="space-y-1 text-center">
          <div className="text-label-lg text-text-strong-950">
            {employee.fullName}
          </div>
          <div className="font-mono text-paragraph-sm text-text-sub-600">
            {employee.employeeId ?? "—"}
          </div>
          {employee.jobTitle ? (
            <div className="text-paragraph-sm text-text-sub-600">
              {employee.jobTitle}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge.Root color="blue" size="small" variant="lighter">
            {stats.assignedTotal} assigned
          </Badge.Root>
          <Badge.Root color="purple" size="small" variant="lighter">
            {stats.reportedTotal} reported
          </Badge.Root>
          <StatusBadge.Root
            status={trendPositive ? "completed" : "failed"}
            variant="light"
          >
            <StatusBadge.Dot />
            {trendPositive ? "+" : ""}
            {stats.ticketTrendPercent}% this week
          </StatusBadge.Root>
        </div>
      </div>

      <TabMenu.List className="px-5">
        <TabMenu.Trigger value="overview">
          <TabMenu.Icon as={RiUserLine} />
          Overview
        </TabMenu.Trigger>
        <TabMenu.Trigger value="tickets">
          <TabMenu.Icon as={RiTicketLine} />
          Tickets
        </TabMenu.Trigger>
        <TabMenu.Trigger value="activity">
          <TabMenu.Icon as={RiChat3Line} />
          Activity
        </TabMenu.Trigger>
      </TabMenu.List>

      <TabMenu.Content value="overview">
        <div className="grid grid-cols-2 gap-3 p-5">
          <StatCard label="Open" value={stats.open} />
          <StatCard label="In progress" value={stats.inProgress} />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard
            label="Completion rate"
            sublabel="Of assigned tickets"
            value={`${stats.completionRate}%`}
          />
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Weekly assigned tickets
        </Divider.Root>
        <div className="px-5 py-4">
          <WeeklyChart data={data.weeklyTickets} />
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Status breakdown
        </Divider.Root>
        <div className="grid grid-cols-2 gap-4 p-5">
          <MiniPieChart data={data.statusBreakdown} />
          <BreakdownLegend items={data.statusBreakdown} />
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Priority mix
        </Divider.Root>
        <div className="space-y-2 p-5">
          {data.priorityBreakdown.map((item) => (
            <div className="space-y-1" key={item.id}>
              <div className="flex items-center justify-between text-paragraph-xs">
                <span className="text-text-sub-600 capitalize">{item.name}</span>
                <span className="text-label-xs text-text-strong-950">
                  {item.count}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-bg-soft-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </TabMenu.Content>

      <TabMenu.Content value="tickets">
        <Divider.Root className="px-5" variant="solid-text">
          Assigned tickets
        </Divider.Root>
        <div className="space-y-1 px-5 py-3">
          {data.assignedTickets.length === 0 ? (
            <p className="py-6 text-center text-paragraph-sm text-text-soft-400">
              No assigned tickets.
            </p>
          ) : (
            data.assignedTickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Reported tickets
        </Divider.Root>
        <div className="space-y-1 px-5 py-3">
          {data.reportedTickets.length === 0 ? (
            <p className="py-6 text-center text-paragraph-sm text-text-soft-400">
              No reported tickets.
            </p>
          ) : (
            data.reportedTickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>
      </TabMenu.Content>

      <TabMenu.Content value="activity">
        <Divider.Root className="px-5" variant="solid-text">
          Recent activity
        </Divider.Root>
        <div className="space-y-1 px-5 py-3">
          {data.recentActivity.length === 0 ? (
            <p className="py-6 text-center text-paragraph-sm text-text-soft-400">
              No activity logged yet.
            </p>
          ) : (
            data.recentActivity.map((entry) => (
              <ActivityRow entry={entry} key={entry.id} />
            ))
          )}
        </div>

        {data.topLocations.length > 0 ? (
          <>
            <Divider.Root className="px-5" variant="solid-text">
              Top locations
            </Divider.Root>
            <div className="space-y-2 p-5">
              {data.topLocations.map((location) => (
                <Link
                  className="flex items-center justify-between rounded-xl bg-bg-weak-50 px-3 py-2 ring-1 ring-stroke-soft-200 ring-inset transition hover:opacity-80"
                  href={location.href}
                  key={location.id}
                >
                  <div className="flex items-center gap-2">
                    <RiMapPinLine className="size-4 text-primary-base" />
                    <span className="text-label-sm text-text-strong-950">
                      {location.label}
                    </span>
                  </div>
                  <Badge.Root color="gray" size="small" variant="lighter">
                    {location.count} tickets
                  </Badge.Root>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        <Divider.Root className="px-5" variant="solid-text">
          Contact & context
        </Divider.Root>
        <div className="space-y-3 p-5">
          {employee.email ? (
            <div className="flex items-center gap-3 text-paragraph-sm text-text-sub-600">
              <RiMailLine className="size-4 shrink-0" />
              {employee.email}
            </div>
          ) : null}
          {employee.phone ? (
            <div className="flex items-center gap-3 text-paragraph-sm text-text-sub-600">
              <RiPhoneLine className="size-4 shrink-0" />
              {employee.phone}
            </div>
          ) : null}
          {employee.team ? (
            <div className="flex items-center gap-3 text-paragraph-sm text-text-sub-600">
              <RiTeamLine className="size-4 shrink-0" />
              {employee.team.label}
            </div>
          ) : null}
          {data.typeBreakdown.length > 0 ? (
            <div className="pt-2">
              <div className="mb-2 text-subheading-xs text-text-soft-400 uppercase">
                Ticket types handled
              </div>
              <div className="flex flex-wrap gap-2">
                {data.typeBreakdown.map((item) => (
                  <Badge.Root
                    color="gray"
                    key={item.id}
                    size="small"
                    variant="lighter"
                  >
                    {item.name} · {item.count}
                  </Badge.Root>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </TabMenu.Content>
    </TabMenu.Root>
  );
}

export function EmployeeDetailDrawer({
  onOpenChange,
  open,
  employeeId,
}: EmployeeDetailDrawerProps) {
  const [data, setData] = useState<EmployeeDrawerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!employeeId) {
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/mockups/mr/employees/${encodeURIComponent(employeeId)}/drawer`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load employee details.");
        }
        return response.json() as Promise<EmployeeDrawerData>;
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
        setError("Could not load employee details.");
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [open, employeeId]);

  return (
    <Drawer.Root onOpenChange={onOpenChange} open={open}>
      <Drawer.Content className="max-w-[480px]">
        <Drawer.Header className="border-stroke-soft-200 border-b">
          <Drawer.Title>Employee profile</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          {loading ? <DrawerSkeleton /> : null}
          {!loading && error ? (
            <p className="p-5 text-error-base text-paragraph-sm">{error}</p>
          ) : null}
          {!loading && data ? <EmployeeDrawerContent data={data} /> : null}
        </Drawer.Body>
        {data ? (
          <Drawer.Footer className="border-stroke-soft-200 border-t">
            {data.employee.company.href ? (
              <Button.Root
                asChild
                className="w-full"
                mode="stroke"
                size="medium"
                variant="neutral"
              >
                <Link href={data.employee.company.href as Route}>
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

export function EmployeeRowTrigger({
  employee,
  onOpen,
}: {
  employee: Pick<Employee, "fullName" | "employeeId">;
  onOpen: () => void;
}) {
  return (
    <button
      className="group flex min-w-0 items-center gap-3 text-left transition duration-200 ease-out hover:opacity-80"
      onClick={onOpen}
      type="button"
    >
      <Avatar.Root size="40">{initials(employee.fullName)}</Avatar.Root>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-text-strong-950 group-hover:text-primary-base">
          {employee.fullName}
        </div>
        <div className="truncate font-mono text-paragraph-xs text-text-sub-600">
          {employee.employeeId ?? "—"}
        </div>
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
