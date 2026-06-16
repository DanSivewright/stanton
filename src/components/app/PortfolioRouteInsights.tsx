"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/utils/cn";

type SimpleDatum = {
  label: string;
  value: number;
};

type MultiSeriesDatum = {
  label: string;
  open: number;
  closed: number;
  review: number;
  problems: number;
};

const CHART_COLORS = [
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#14b8a6",
  "#ef4444",
] as const;

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

function StatBlock({
  label,
  value,
  meta,
}: {
  label: string;
  value: string | number;
  meta?: string;
}) {
  return (
    <div className="rounded-xl bg-bg-weak-50 px-4 py-3 ring-1 ring-stroke-soft-200 ring-inset">
      <p className="text-label-sm text-text-sub-600">{label}</p>
      <p className="mt-1 text-text-strong-950 text-title-h5">{value}</p>
      {meta ? <p className="mt-0.5 text-paragraph-xs text-text-soft-400">{meta}</p> : null}
    </div>
  );
}

function PieBreakdown({
  data,
  title,
}: {
  data: SimpleDatum[];
  title: string;
}) {
  return (
    <ChartCard>
      <div className="border-stroke-soft-200 border-b px-5 py-4">
        <p className="text-label-md text-text-strong-950">{title}</p>
      </div>
      <div className="grid gap-4 px-5 py-4 min-[700px]:grid-cols-[140px_minmax(0,1fr)] min-[700px]:items-center">
        <div className="mx-auto h-[140px] w-[140px]">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="value"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    fill={CHART_COLORS[index % CHART_COLORS.length] ?? "#f97316"}
                    key={entry.label}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map((entry, index) => (
            <div className="flex items-center justify-between gap-3" key={entry.label}>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      CHART_COLORS[index % CHART_COLORS.length] ?? "#f97316",
                  }}
                />
                <span className="text-label-sm text-text-strong-950">{entry.label}</span>
              </div>
              <span className="text-label-sm text-text-sub-600">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

function SingleBarChart({
  data,
  title,
  valueLabel,
}: {
  data: SimpleDatum[];
  title: string;
  valueLabel: string;
}) {
  return (
    <ChartCard>
      <div className="border-stroke-soft-200 border-b px-5 py-4">
        <p className="text-label-md text-text-strong-950">{title}</p>
      </div>
      <div className="h-[240px] px-2 py-4">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
            <CartesianGrid stroke="#eef0f3" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#868c98", fontSize: 11 }} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tick={{ fill: "#868c98", fontSize: 11 }} tickLine={false} />
            <Tooltip formatter={(value) => [value, valueLabel]} />
            <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function AssetsInsights({
  stats,
  byStatus,
  topProblemLocations,
}: {
  stats: { label: string; value: string | number; meta?: string }[];
  byStatus: SimpleDatum[];
  topProblemLocations: SimpleDatum[];
}) {
  return (
    <div className="space-y-4 py-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatBlock key={stat.label} label={stat.label} meta={stat.meta} value={stat.value} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <PieBreakdown data={byStatus} title="Asset Status Mix" />
        <SingleBarChart
          data={topProblemLocations}
          title="Locations With Most Problem Assets"
          valueLabel="Problem assets"
        />
      </div>
    </div>
  );
}

export function TicketsInsights({
  stats,
  byStatus,
  byPriority,
}: {
  stats: { label: string; value: string | number; meta?: string }[];
  byStatus: SimpleDatum[];
  byPriority: SimpleDatum[];
}) {
  return (
    <div className="space-y-4 py-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatBlock key={stat.label} label={stat.label} meta={stat.meta} value={stat.value} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <PieBreakdown data={byStatus} title="Ticket Status Mix" />
        <SingleBarChart
          data={byPriority}
          title="Ticket Priority Distribution"
          valueLabel="Tickets"
        />
      </div>
    </div>
  );
}

export function MaintenanceTeamsInsights({
  stats,
  byPerson,
  byTeamOpen,
}: {
  stats: { label: string; value: string | number; meta?: string }[];
  byPerson: MultiSeriesDatum[];
  byTeamOpen: SimpleDatum[];
}) {
  return (
    <div className="space-y-4 py-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatBlock key={stat.label} label={stat.label} meta={stat.meta} value={stat.value} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard>
          <div className="border-stroke-soft-200 border-b px-5 py-4">
            <p className="text-label-md text-text-strong-950">People Workload Snapshot</p>
            <p className="mt-0.5 text-paragraph-xs text-text-soft-400">
              Open, closed, pending review, and problem tickets
            </p>
          </div>
          <div className="h-[280px] px-2 py-4">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                data={byPerson}
                margin={{ top: 8, right: 16, left: 0, bottom: 16 }}
              >
                <CartesianGrid stroke="#eef0f3" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#868c98", fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tick={{ fill: "#868c98", fontSize: 11 }}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="open" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="review" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="problems" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <SingleBarChart
          data={byTeamOpen}
          title="Teams With Most Open Tickets"
          valueLabel="Open tickets"
        />
      </div>
    </div>
  );
}
