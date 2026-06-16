"use client";

import {
  RiAlertFill,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiBuilding2Line,
  RiDashboardLine,
  RiHomeLine,
  RiMapLine,
  RiSearchLine,
  RiTeamLine,
  RiTicketLine,
  RiToolsLine,
} from "@remixicon/react";
import * as d3 from "d3";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import {
  RecentActivitiesPanel,
  RecentTicketsPanel,
} from "@/components/app/HubSidePanels";
import * as Alert from "@/components/ui/alert";
import * as Avatar from "@/components/ui/avatar";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import * as CompactButton from "@/components/ui/compact-button";
import * as LinkButton from "@/components/ui/link-button";
import * as ProgressBar from "@/components/ui/progress-bar";
import * as StatusBadge from "@/components/ui/status-badge";
import {
  type BreakdownItem,
  formatDurationHours,
} from "@/lib/app/drawer-stats";
import type {
  HubOverviewData,
  HubRankedEntity,
  HubTeamPerformance,
} from "@/lib/app/hub-overview-types";
import { APP_NAV } from "@/lib/app/navigation";
import { cn } from "@/utils/cn";

type HubDashboardProps = {
  data: HubOverviewData;
};

const QUICK_LINK_ICONS = {
  companies: RiHomeLine,
  locations: RiMapLine,
  assets: RiToolsLine,
  tickets: RiTicketLine,
  "maintenance-teams": RiTeamLine,
} as const;

function TrendBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <StatusBadge.Root
      status={positive ? "completed" : "failed"}
      variant="light"
    >
      <StatusBadge.Dot />
      {positive ? "+" : ""}
      {value}% vs last week
    </StatusBadge.Root>
  );
}

function ChartCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-stroke-soft-200 ring-inset",
        className
      )}
    >
      {children}
    </div>
  );
}

function SegmentedProgressBar({
  percentage,
  color = "#f97316",
  segments = 48,
}: {
  percentage: number;
  color?: string;
  segments?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const filled = Math.round((percentage / 100) * segments);
    const gap = 3;
    const width = node.clientWidth;
    const segmentWidth = (width - gap * (segments - 1)) / segments;

    d3.select(node).selectAll("*").remove();

    const svg = d3
      .select(node)
      .append("svg")
      .attr("width", width)
      .attr("height", 28)
      .attr("role", "img");

    svg
      .selectAll("rect")
      .data(d3.range(segments))
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * (segmentWidth + gap))
      .attr("y", 0)
      .attr("width", segmentWidth)
      .attr("height", 28)
      .attr("rx", 4)
      .attr("fill", (_, i) =>
        i < filled ? color : "var(--color-bg-soft-200, #e2e4e9)"
      );
  }, [color, mounted, percentage, segments]);

  return (
    <div className="h-7 w-full" ref={ref} suppressHydrationWarning>
      {mounted ? null : (
        <div className="h-full w-full animate-pulse rounded-lg bg-bg-weak-50" />
      )}
    </div>
  );
}

function HubHeader() {
  return (
    <header className="flex min-h-[88px] w-full flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8">
      <div className="flex flex-1 gap-4 lg:gap-3.5">
        <Avatar.Root size="24">
          <RiDashboardLine className="size-5 text-text-sub-600" />
        </Avatar.Root>
        <div>
          <Breadcrumb.Root className="w-fit items-center">
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item active>Home</Breadcrumb.Item>
          </Breadcrumb.Root>
          {/* <p className="mt-1 text-paragraph-sm text-text-sub-600">
            Maintenance operations across the Catalyst portfolio
          </p> */}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button.Root mode="ghost" variant="neutral">
          <Button.Icon as={RiSearchLine} />
        </Button.Root>
        <Button.Root asChild mode="filled" size="medium" variant="primary">
          <Link href="/tickets">
            <Button.Icon as={RiTicketLine} />
            View tickets
          </Link>
        </Button.Root>
      </div>
    </header>
  );
}

function StatsRow({ data }: { data: HubOverviewData }) {
  const stats = [
    {
      label: "Open tickets",
      value: data.openTickets,
      meta: `of ${data.totalTickets} total`,
      accent: data.openTickets > 0,
    },
    {
      label: "Completion rate",
      value: `${data.completionRate}%`,
      meta: formatDurationHours(data.avgResolutionHours),
    },
    {
      label: "Companies",
      value: data.counts.companies ?? 0,
      meta: `${data.counts.locations ?? 0} locations`,
    },
    {
      label: "Assets",
      value: data.totalAssets,
      meta: `${data.counts["maintenance-teams"] ?? 0} teams`,
    },
    {
      label: "Employees",
      value: data.counts.employees ?? 0,
      meta: `${data.counts["asset-movements"] ?? 0} movements`,
    },
    {
      label: "Pending review",
      value: data.pendingReview,
      meta: data.pendingReview > 0 ? "Needs attention" : "All clear",
      accent: data.pendingReview > 0,
    },
  ];

  return (
    <div className="flex flex-wrap py-6">
      {stats.map((stat, index) => (
        <div
          className={cn(
            "w-full pb-4 first:pl-0 last:pr-0 sm:w-1/2 sm:px-7 sm:pb-0 xl:w-1/3 xl:pb-0",
            index > 0 &&
              index % 2 === 1 &&
              "border-stroke-soft-200 border-t pt-4 sm:border-transparent sm:pt-0",
            index >= 2 &&
              "border-stroke-soft-200 border-t pt-4 xl:border-transparent xl:pt-0"
          )}
          key={stat.label}
        >
          <div className="text-label-sm text-text-sub-600">{stat.label}</div>
          <div className="mt-1 flex items-center gap-1.5">
            <div
              className={cn(
                "text-title-h5",
                stat.accent ? "text-warning-base" : "text-text-strong-950"
              )}
            >
              {stat.value}
            </div>
            <div className="text-label-xs text-text-sub-600">{stat.meta}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TicketsTrendChart({ data }: { data: HubOverviewData }) {
  const gradientId = "hub-ticket-gradient";

  return (
    <ChartCard>
      <div className="flex flex-wrap items-start justify-between gap-4 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-sm text-text-sub-600">Ticket Volume</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-text-strong-950 text-title-h5">
              {data.totalTickets.toLocaleString()}
            </p>
            <TrendBadge value={data.ticketTrendPercent} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-bg-weak-50 px-3 py-1.5 text-label-xs text-text-sub-600 ring-1 ring-stroke-soft-200 ring-inset">
            7 weeks
          </span>
          <LinkButton.Root asChild size="medium" variant="gray">
            <Link href="/tickets">Details</Link>
          </LinkButton.Root>
        </div>
      </div>
      <div className="h-[220px] px-2 pt-2 pb-4">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={data.weeklyTickets}
            margin={{ top: 12, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: "#868c98", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#868c98", fontSize: 11 }}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e4e9",
                boxShadow: "0 4px 12px rgba(10, 13, 20, 0.08)",
              }}
              formatter={(value) => [value, "Reported"]}
            />
            <Area
              dataKey="count"
              fill={`url(#${gradientId})`}
              stroke="#f97316"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

function CompletionsTrendChart({ data }: { data: HubOverviewData }) {
  const gradientId = "hub-completion-gradient";
  const totalCompletions = data.weeklyCompletions.reduce(
    (sum, point) => sum + point.count,
    0
  );

  return (
    <ChartCard>
      <div className="flex flex-wrap items-start justify-between gap-4 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-sm text-text-sub-600">Weekly Completions</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-text-strong-950 text-title-h5">
              {totalCompletions}
            </p>
            <StatusBadge.Root status="completed" variant="light">
              <StatusBadge.Dot />
              {data.completionRate}% overall
            </StatusBadge.Root>
          </div>
        </div>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href="/tickets">View closed</Link>
        </LinkButton.Root>
      </div>
      <div className="h-[180px] px-2 pt-2 pb-4">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={data.weeklyCompletions}
            margin={{ top: 12, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: "#868c98", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tick={{ fill: "#868c98", fontSize: 11 }}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e4e9",
                boxShadow: "0 4px 12px rgba(10, 13, 20, 0.08)",
              }}
              formatter={(value) => [value, "Completed"]}
            />
            <Area
              dataKey="count"
              fill={`url(#${gradientId})`}
              stroke="#22c55e"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

function StatusBreakdownCard({ items }: { items: BreakdownItem[] }) {
  const topItem = items[0] ?? null;

  return (
    <ChartCard>
      <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-sm text-text-sub-600">Ticket Status</p>
          {topItem ? (
            <div className="mt-1 flex items-center gap-2">
              <p className="text-text-strong-950 text-title-h5">
                {topItem.percentage}%
              </p>
              <StatusBadge.Root status="completed" variant="light">
                <StatusBadge.Dot />
                {topItem.name}
              </StatusBadge.Root>
            </div>
          ) : (
            <p className="mt-1 text-paragraph-sm text-text-soft-400">
              No tickets yet
            </p>
          )}
        </div>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href="/tickets">Details</Link>
        </LinkButton.Root>
      </div>
      <div className="space-y-4 px-5 py-4">
        <SegmentedProgressBar
          color={topItem?.color ?? "#3b82f6"}
          percentage={topItem?.percentage ?? 0}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <div
              className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-3 py-2"
              key={item.id}
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-label-sm text-text-strong-950">
                  {item.name}
                </span>
              </div>
              <span className="text-label-xs text-text-sub-600">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

function TicketTypesDonut({ items }: { items: BreakdownItem[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <ChartCard>
      <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <p className="text-label-sm text-text-sub-600">Ticket Types</p>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href="/tickets">View reports</Link>
        </LinkButton.Root>
      </div>
      <div className="grid gap-4 px-5 py-4 min-[700px]:grid-cols-[140px_minmax(0,1fr)] min-[700px]:items-center">
        <div className="mx-auto h-[140px] w-[140px]">
          {items.length > 0 ? (
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={items}
                  dataKey="count"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {items.map((item) => (
                    <Cell fill={item.color} key={item.id} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-full bg-bg-weak-50 text-paragraph-xs text-text-soft-400">
              No data
            </div>
          )}
        </div>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-paragraph-sm text-text-soft-400">
              No tickets logged yet.
            </p>
          ) : (
            items.map((item) => (
              <div
                className="flex items-center justify-between gap-3"
                key={item.id}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-label-sm text-text-strong-950">
                    {item.name}
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-label-sm text-text-strong-950">
                    {item.count}
                  </p>
                  <p className="text-paragraph-xs text-text-soft-400">
                    {item.percentage}%
                  </p>
                </div>
              </div>
            ))
          )}
          {total > 0 ? (
            <p className="text-paragraph-xs text-text-soft-400">
              {total} tickets across {items.length} type
              {items.length === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
      </div>
    </ChartCard>
  );
}

function AssetStatusCard({ topItem }: { topItem: BreakdownItem | null }) {
  const coverage = topItem?.percentage ?? 0;

  return (
    <ChartCard>
      <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-sm text-text-sub-600">Asset Status</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-text-strong-950 text-title-h5">{coverage}%</p>
            {topItem ? (
              <StatusBadge.Root status="completed" variant="light">
                <StatusBadge.Dot />
                {topItem.name}
              </StatusBadge.Root>
            ) : null}
          </div>
        </div>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href="/assets">Details</Link>
        </LinkButton.Root>
      </div>
      <div className="space-y-4 px-5 py-4">
        <SegmentedProgressBar
          color={topItem?.color ?? "#14b8a6"}
          percentage={coverage}
        />
        {topItem ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CompactButton.Root size="medium" variant="ghost">
                <CompactButton.Icon as={RiArrowLeftSLine} />
              </CompactButton.Root>
              <span className="text-label-sm text-text-strong-950">
                {topItem.name}
              </span>
              <CompactButton.Root size="medium" variant="ghost">
                <CompactButton.Icon as={RiArrowRightSLine} />
              </CompactButton.Root>
            </div>
            <StatusBadge.Root status="completed" variant="light">
              <StatusBadge.Dot />
              {topItem.count} assets
            </StatusBadge.Root>
          </div>
        ) : (
          <p className="text-paragraph-sm text-text-soft-400">
            No assets registered yet.
          </p>
        )}
      </div>
    </ChartCard>
  );
}

function PriorityCoverageCard({
  coveragePercent,
  items,
}: {
  coveragePercent: number;
  items: BreakdownItem[];
}) {
  return (
    <ChartCard>
      <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-sm text-text-sub-600">
            Open &amp; High Priority
          </p>
          <p className="mt-1 text-text-strong-950 text-title-h5">
            {coveragePercent}%
          </p>
        </div>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href="/tickets">Details</Link>
        </LinkButton.Root>
      </div>
      <div className="space-y-3 px-5 py-4">
        <SegmentedProgressBar color="#ef4444" percentage={coveragePercent} />
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <div
              className="flex items-center justify-between rounded-lg bg-bg-weak-50 px-3 py-2"
              key={item.id}
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-label-sm text-text-strong-950">
                  {item.name}
                </span>
              </div>
              <span className="text-label-xs text-text-sub-600">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

function TopLocationsChart({ items }: { items: HubRankedEntity[] }) {
  const chartData = items.map((item) => ({
    name: item.name.length > 18 ? `${item.name.slice(0, 16)}…` : item.name,
    fullName: item.name,
    count: item.count,
    meta: item.meta,
  }));

  return (
    <ChartCard>
      <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-sm text-text-sub-600">Top Locations</p>
          <p className="mt-0.5 text-paragraph-xs text-text-soft-400">
            By ticket volume
          </p>
        </div>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href="/locations">All locations</Link>
        </LinkButton.Root>
      </div>
      <div className="h-[220px] px-2 py-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <XAxis
                axisLine={false}
                tick={{ fill: "#868c98", fontSize: 11 }}
                tickLine={false}
                type="number"
              />
              <YAxis
                axisLine={false}
                dataKey="name"
                tick={{ fill: "#525866", fontSize: 11 }}
                tickLine={false}
                type="category"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e4e9",
                  boxShadow: "0 4px 12px rgba(10, 13, 20, 0.08)",
                }}
                formatter={(value, _name, props) => {
                  const payload = props.payload as {
                    fullName: string;
                    meta?: string;
                  };
                  return [
                    value,
                    payload.meta
                      ? `${payload.fullName} · ${payload.meta}`
                      : payload.fullName,
                  ];
                }}
              />
              <Bar
                barSize={16}
                dataKey="count"
                fill="#6366f1"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-paragraph-sm text-text-soft-400">
            No location data yet
          </div>
        )}
      </div>
    </ChartCard>
  );
}

function RankedListCard({
  href,
  items,
  linkLabel,
  title,
  variant,
}: {
  href: string;
  items: HubRankedEntity[];
  linkLabel: string;
  title: string;
  variant: "company" | "team";
}) {
  return (
    <ChartCard>
      <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <p className="text-label-sm text-text-sub-600">{title}</p>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href={href}>{linkLabel}</Link>
        </LinkButton.Root>
      </div>
      <div className="divide-y divide-stroke-soft-200 px-2 py-1">
        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-paragraph-sm text-text-soft-400">
            No data yet
          </p>
        ) : (
          items.map((item, index) => (
            <Link
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-bg-weak-50"
              href={
                variant === "company"
                  ? `/companies/${item.id}`
                  : "/maintenance-teams"
              }
              key={item.id}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-bg-weak-50 text-label-xs text-text-sub-600 ring-1 ring-stroke-soft-200 ring-inset">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-label-sm text-text-strong-950">
                  {item.name}
                </p>
                {item.meta ? (
                  <p className="truncate text-paragraph-xs text-text-soft-400">
                    {item.meta}
                  </p>
                ) : null}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-label-sm text-text-strong-950">
                  {item.count}
                </p>
                {item.percentage == null ? null : (
                  <p className="text-paragraph-xs text-text-soft-400">
                    {item.percentage}%
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </ChartCard>
  );
}

function TeamPerformanceCard({ teams }: { teams: HubTeamPerformance[] }) {
  return (
    <ChartCard>
      <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-sm text-text-sub-600">Team Performance</p>
          <p className="mt-0.5 text-paragraph-xs text-text-soft-400">
            Assigned tickets &amp; completion rate
          </p>
        </div>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href="/maintenance-teams">All teams</Link>
        </LinkButton.Root>
      </div>
      <div className="space-y-4 px-5 py-4">
        {teams.length === 0 ? (
          <p className="py-4 text-center text-paragraph-sm text-text-soft-400">
            No team assignments yet
          </p>
        ) : (
          teams.map((team) => (
            <div className="space-y-2" key={team.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <RiTeamLine className="size-4 shrink-0 text-text-sub-600" />
                  <span className="truncate text-label-sm text-text-strong-950">
                    {team.name}
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-label-sm text-text-strong-950">
                    {team.completed}/{team.assigned}
                  </span>
                  <span className="ml-2 text-label-xs text-text-sub-600">
                    {team.completionRate}%
                  </span>
                </div>
              </div>
              <ProgressBar.Root color="green" value={team.completionRate} />
            </div>
          ))
        )}
      </div>
    </ChartCard>
  );
}

function getNavItemCount(data: HubOverviewData, slug: string) {
  if (slug === "companies") {
    return data.counts.companies;
  }
  if (slug === "locations") {
    return data.counts.locations;
  }
  return data.counts[slug];
}

function QuickNavCard({ data }: { data: HubOverviewData }) {
  const navItems = APP_NAV.flatMap((group) => group.items).filter(
    (item) => item.href !== "/"
  );

  return (
    <ChartCard>
      <div className="border-stroke-soft-200 border-b px-5 py-4">
        <p className="text-label-md text-text-strong-950">Quick navigation</p>
        <p className="mt-0.5 text-paragraph-xs text-text-sub-600">
          Jump to any collection
        </p>
      </div>
      <div className="grid gap-2 p-3 sm:grid-cols-2">
        {navItems.map((item) => {
          const slug = item.href.split("/").pop() ?? "";
          const Icon =
            QUICK_LINK_ICONS[slug as keyof typeof QUICK_LINK_ICONS] ??
            RiBuilding2Line;
          const count = getNavItemCount(data, slug);

          return (
            <Link
              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-stroke-soft-200 hover:bg-bg-weak-50"
              href={item.href}
              key={item.href}
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-bg-weak-50 text-text-sub-600 ring-1 ring-stroke-soft-200 ring-inset transition group-hover:text-primary-base">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-label-sm text-text-strong-950">
                  {item.label}
                </p>
                <p className="text-paragraph-xs text-text-soft-400">
                  {count ?? 0} records
                </p>
              </div>
              <RiArrowRightLine className="size-4 shrink-0 text-text-soft-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </ChartCard>
  );
}

function AlertBanner({ data }: { data: HubOverviewData }) {
  if (data.openTickets === 0 && data.pendingReview === 0) {
    return null;
  }

  return (
    <Alert.Root size="small" status="warning" variant="lighter">
      <Alert.Icon as={RiAlertFill} />
      <div>
        <strong className="text-label-sm">
          {data.openTickets} open ticket{data.openTickets === 1 ? "" : "s"}
        </strong>
        {data.pendingReview > 0 ? (
          <span className="text-paragraph-sm text-text-sub-600">
            {" "}
            · {data.pendingReview} pending review
          </span>
        ) : null}
        <span className="text-paragraph-sm text-text-sub-600">
          {" "}
          across the portfolio
        </span>
      </div>
    </Alert.Root>
  );
}

export function HubDashboard({ data }: HubDashboardProps) {
  return (
    <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-col">
      <HubHeader />

      <div className="px-4 pb-8 lg:px-8">
        {/* <DottedRule />
        <StatsRow data={data} />
        <DottedRule /> */}

        <div className="py-6">
          <AlertBanner data={data} />
        </div>

        <div className="flex flex-1 flex-col gap-6 min-[1200px]:flex-row">
          <div className="min-w-0 flex-1 space-y-4">
            <TicketsTrendChart data={data} />
            <div className="grid gap-4 lg:grid-cols-2">
              <CompletionsTrendChart data={data} />
              <StatusBreakdownCard items={data.ticketStatuses} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <TicketTypesDonut items={data.ticketTypes} />
              <AssetStatusCard topItem={data.topAssetStatus} />
            </div>
            <PriorityCoverageCard
              coveragePercent={data.priorityCoveragePercent}
              items={data.ticketPriorities}
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <TopLocationsChart items={data.topLocations} />
              <RankedListCard
                href="/companies"
                items={data.topCompanies}
                linkLabel="All companies"
                title="Top Companies"
                variant="company"
              />
            </div>
            <TeamPerformanceCard teams={data.topTeams} />
          </div>

          <div className="shrink-0 space-y-4 min-[1200px]:w-[360px]">
            <QuickNavCard data={data} />
            <RecentActivitiesPanel data={data} />
            <RecentTicketsPanel data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
