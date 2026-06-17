// @ts-nocheck
"use client";

import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiChat3Line,
  RiCheckboxCircleLine,
  RiEyeLine,
  RiImageLine,
  RiSearchLine,
} from "@remixicon/react";
import { Command } from "cmdk";
import * as d3 from "d3";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as CompactButton from "@/components/ui/compact-button";
import * as Kbd from "@/components/ui/kbd";
import * as LinkButton from "@/components/ui/link-button";
import * as Modal from "@/components/ui/modal";
import * as SegmentedControl from "@/components/ui/segmented-control";
import * as StatusBadge from "@/components/ui/status-badge";
import {
  type BreakdownItem,
  filterActivitiesByPeriod,
  type LocationActivityItem,
  type LocationOverviewData,
} from "@/lib/app/location-overview-types";
import { getLocationTabHref } from "@/lib/app/location-tabs";
import { cn } from "@/utils/cn";

type LocationOverviewDashboardProps = {
  data: LocationOverviewData;
  locationId: string;
};

const ACTIVITY_ICONS = {
  comment: RiChat3Line,
  photo: RiImageLine,
  completion: RiCheckboxCircleLine,
  review: RiEyeLine,
} as const;

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("en-ZA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

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

function TicketsTrendChart({
  weeklyTickets,
  totalTickets,
  trendPercent,
}: {
  weeklyTickets: LocationOverviewData["weeklyTickets"];
  totalTickets: number;
  trendPercent: number;
}) {
  const gradientId = "location-ticket-gradient";

  return (
    <ChartCard>
      <div className="flex flex-wrap items-start justify-between gap-4 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-sm text-text-sub-600">Total Tickets</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-text-strong-950 text-title-h5">
              {totalTickets.toLocaleString()}
            </p>
            <TrendBadge value={trendPercent} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-bg-weak-50 px-3 py-1.5 text-label-xs text-text-sub-600 ring-1 ring-stroke-soft-200 ring-inset">
            Weekly
          </span>
          <span className="rounded-lg bg-bg-weak-50 px-3 py-1.5 text-label-xs text-text-sub-600 ring-1 ring-stroke-soft-200 ring-inset">
            All types
          </span>
        </div>
      </div>
      <div className="h-[220px] px-2 pt-2 pb-4">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={weeklyTickets}
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
              formatter={(value) => [value, "Tickets"]}
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

function AssetStatusCard({
  items,
  locationId,
  topItem,
}: {
  items: BreakdownItem[];
  locationId: string;
  topItem: BreakdownItem | null;
}) {
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
          <Link href={getLocationTabHref(locationId, "assets")}>Details</Link>
        </LinkButton.Root>
      </div>
      <div className="space-y-4 px-5 py-4">
        <SegmentedProgressBar
          color={topItem?.color ?? "#f97316"}
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
            No assets at this location yet.
          </p>
        )}
        {items.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {items.slice(0, 4).map((item) => (
              <span
                className="inline-flex items-center gap-1.5 rounded-md bg-bg-weak-50 px-2 py-1 text-label-xs text-text-sub-600"
                key={item.id}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name} ({item.percentage}%)
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </ChartCard>
  );
}

function TicketTypesDonut({
  items,
  locationId,
}: {
  items: BreakdownItem[];
  locationId: string;
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <ChartCard>
      <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <p className="text-label-sm text-text-sub-600">Ticket Types</p>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href={getLocationTabHref(locationId, "tickets")}>
            View reports
          </Link>
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
              No tickets logged for this location.
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

function TicketPriorityCard({
  coveragePercent,
  items,
  locationId,
}: {
  coveragePercent: number;
  items: BreakdownItem[];
  locationId: string;
}) {
  return (
    <ChartCard>
      <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-sm text-text-sub-600">
            Open &amp; High Priority
          </p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-text-strong-950 text-title-h5">
              {coveragePercent}%
            </p>
          </div>
        </div>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href={getLocationTabHref(locationId, "tickets")}>Details</Link>
        </LinkButton.Root>
      </div>
      <div className="space-y-3 px-5 py-4">
        <SegmentedProgressBar color="#f97316" percentage={coveragePercent} />
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

function ActivitySearchDialog({
  activities,
  locationId,
  onOpenChange,
  open,
}: {
  activities: LocationActivityItem[];
  locationId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  return (
    <Modal.Root onOpenChange={onOpenChange} open={open}>
      <Modal.Content
        className="flex max-h-full max-w-[600px] flex-col overflow-hidden rounded-2xl"
        overlayClassName="justify-start pt-20"
        showClose={false}
      >
        <Command
          className={cn(
            "divide-y divide-stroke-soft-200",
            "grid min-h-0 auto-cols-auto grid-flow-row",
            "[&>[cmdk-label]+*]:!border-t-0"
          )}
        >
          <div className="group/cmd-input flex items-center gap-2 px-4 py-3">
            <RiSearchLine className="size-5 shrink-0 text-text-sub-600" />
            <Command.Input
              className={cn(
                "w-full bg-transparent text-paragraph-sm text-text-strong-950 outline-none",
                "placeholder:text-text-soft-400"
              )}
              placeholder="Search activities..."
            />
            <Kbd.Root>⌘K</Kbd.Root>
          </div>
          <Command.List className="max-h-[360px] overflow-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-paragraph-sm text-text-soft-400">
              No matching activity.
            </Command.Empty>
            <Command.Group heading="Activities">
              {activities.map((item) => (
                <Command.Item
                  className="flex cursor-pointer items-center gap-3 rounded-10 px-3 py-2.5 text-paragraph-sm text-text-strong-950 data-[selected=true]:bg-bg-weak-50"
                  key={item.id}
                  onSelect={() => onOpenChange(false)}
                  value={`${item.title} ${item.description} ${item.authorName}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {item.title}
                    </span>
                    <span className="block truncate text-paragraph-xs text-text-sub-600">
                      {item.description}
                    </span>
                  </span>
                  <Link
                    className="shrink-0 text-label-xs text-primary-base"
                    href={getLocationTabHref(locationId, "tickets")}
                  >
                    View
                  </Link>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </Modal.Content>
    </Modal.Root>
  );
}

function RecentActivitiesPanel({
  activities,
  activitiesToday,
  locationId,
}: {
  activities: LocationActivityItem[];
  activitiesToday: number;
  locationId: string;
}) {
  const [period, setPeriod] = useState<"today" | "yesterday" | "week">("today");
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = useMemo(
    () => filterActivitiesByPeriod(activities, period),
    [activities, period]
  );

  return (
    <div className="w-full">
      <ChartCard>
        <div className="flex items-start justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
          <div>
            <p className="text-label-md text-text-strong-950">
              Recent Activities
            </p>
            <p className="mt-0.5 text-paragraph-xs text-text-sub-600">
              {activitiesToday} new{" "}
              {activitiesToday === 1 ? "activity" : "activities"} today
            </p>
          </div>
          <LinkButton.Root asChild size="medium" variant="gray">
            <Link href={getLocationTabHref(locationId, "tickets")}>
              Details
            </Link>
          </LinkButton.Root>
        </div>

        <div className="space-y-4 px-5 py-4">
          <SegmentedControl.Root
            onValueChange={(value) =>
              setPeriod(value as "today" | "yesterday" | "week")
            }
            value={period}
          >
            <SegmentedControl.List>
              <SegmentedControl.Trigger value="today">
                Today
              </SegmentedControl.Trigger>
              <SegmentedControl.Trigger value="yesterday">
                Yesterday
              </SegmentedControl.Trigger>
              <SegmentedControl.Trigger value="week">
                This Week
              </SegmentedControl.Trigger>
            </SegmentedControl.List>
          </SegmentedControl.Root>

          <button
            className="flex w-full items-center gap-2 rounded-xl bg-bg-weak-50 px-3 py-2.5 text-left ring-1 ring-stroke-soft-200 ring-inset transition hover:bg-bg-soft-200"
            onClick={() => setSearchOpen(true)}
            type="button"
          >
            <RiSearchLine className="size-4 shrink-0 text-text-sub-600" />
            <span className="flex-1 text-paragraph-sm text-text-soft-400">
              Search...
            </span>
            <Kbd.Root>⌘K</Kbd.Root>
          </button>

          <div className="max-h-[520px] space-y-1 overflow-auto">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-paragraph-sm text-text-soft-400">
                No activity for this period.
              </p>
            ) : (
              filtered.map((item) => {
                const Icon = ACTIVITY_ICONS[item.kind] ?? RiChat3Line;
                return (
                  <div
                    className="rounded-xl px-2 py-3 transition hover:bg-bg-weak-50"
                    key={item.id}
                  >
                    <div className="flex gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-weak-50 ring-1 ring-stroke-soft-200 ring-inset">
                        <Icon className="size-4 text-text-sub-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-label-sm text-text-strong-950">
                            {item.title}
                          </p>
                          <span className="shrink-0 text-paragraph-xs text-text-soft-400">
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-paragraph-xs text-text-sub-600">
                          {item.description}
                        </p>
                        <p className="mt-1 text-paragraph-xs text-text-soft-400">
                          {item.authorName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </ChartCard>

      <ActivitySearchDialog
        activities={activities}
        locationId={locationId}
        onOpenChange={setSearchOpen}
        open={searchOpen}
      />
    </div>
  );
}

export function LocationOverviewDashboard({
  data,
  locationId,
}: LocationOverviewDashboardProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 py-6 min-[1100px]:flex-row">
      <div className="min-w-0 flex-1 space-y-4">
        <TicketsTrendChart
          totalTickets={data.totalTickets}
          trendPercent={data.ticketTrendPercent}
          weeklyTickets={data.weeklyTickets}
        />
        <AssetStatusCard
          items={data.assetStatuses}
          locationId={locationId}
          topItem={data.topAssetStatus}
        />
        <TicketTypesDonut items={data.ticketTypes} locationId={locationId} />
        <TicketPriorityCard
          coveragePercent={data.priorityCoveragePercent}
          items={data.ticketPriorities}
          locationId={locationId}
        />
      </div>
      <div className="shrink-0 min-[1100px]:w-[328px]">
        <RecentActivitiesPanel
          activities={data.activities}
          activitiesToday={data.activitiesToday}
          locationId={locationId}
        />
      </div>
    </div>
  );
}
