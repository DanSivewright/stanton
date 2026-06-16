"use client";

import {
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiMapPin2Line,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiTimeLine,
  RiToolsLine,
} from "@remixicon/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import * as Select from "@/components/ui/select";
import * as StatusBadge from "@/components/ui/status-badge";
import { cn } from "@/utils/cn";

export type ManufacturingMachineMetric = {
  id: string;
  name: string;
  assetTag: string;
  machineCode?: string | null;
  currentJobLabel?: string | null;
  moNumber?: string | null;
  targetCycleTimeSec?: number | null;
  actualCycleTimeSec?: number | null;
  oeePercent?: number | null;
  targetOutputPerHour?: number | null;
  actualOutputPerHour?: number | null;
  cycleVariancePercent?: number | null;
  productionVariancePercent?: number | null;
  machineStoppage?: boolean | null;
  stoppageReason?: string | null;
  driftDays?: number | null;
  remainQty?: number | null;
  remainHours?: number | null;
  qtyPerDay?: number | null;
  remainDays?: number | null;
  productionEndDate?: string | null;
  satMon?: boolean | null;
  machineStatus?: "running" | "warning" | "critical" | "stopped" | null;
  lastSnapshotAt?: string | null;
  locationName: string;
  locationId: string;
};

type ManufacturingDashboardProps = {
  initialQuery: string;
  locations: Array<{ id: string; name: string }>;
  machines: ManufacturingMachineMetric[];
};

const STATUS_STYLES: Record<
  NonNullable<ManufacturingMachineMetric["machineStatus"]>,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    tone: "completed" | "pending" | "failed" | "disabled";
    ringClass: string;
  }
> = {
  running: {
    icon: RiPlayCircleLine,
    label: "Running",
    tone: "completed",
    ringClass: "ring-success-light-200",
  },
  warning: {
    icon: RiAlarmWarningLine,
    label: "Warning",
    tone: "pending",
    ringClass: "ring-warning-light-200",
  },
  critical: {
    icon: RiErrorWarningLine,
    label: "Critical",
    tone: "failed",
    ringClass: "ring-error-light-200",
  },
  stopped: {
    icon: RiPauseCircleLine,
    label: "Stopped",
    tone: "disabled",
    ringClass: "ring-faded-light-200",
  },
};

const CYCLE_VARIANCE_CRITICAL_THRESHOLD = 5;
const PRODUCTION_VARIANCE_CRITICAL_THRESHOLD = -5;
const OEE_CRITICAL_THRESHOLD = 70;

type AlertTone = "success" | "warning" | "critical";

function getAlertTone(critical: boolean, warning = false): AlertTone {
  if (critical) {
    return "critical";
  }
  if (warning) {
    return "warning";
  }
  return "success";
}

function alertText(label: string, tone: AlertTone) {
  if (tone === "critical") {
    return `${label}: Alert`;
  }
  if (tone === "warning") {
    return `${label}: Watch`;
  }
  return `${label}: OK`;
}

function evaluateMachineAlerts(machine: ManufacturingMachineMetric) {
  const cycleCritical =
    machine.cycleVariancePercent != null &&
    machine.cycleVariancePercent > CYCLE_VARIANCE_CRITICAL_THRESHOLD;
  const productionCritical =
    machine.productionVariancePercent != null &&
    machine.productionVariancePercent < PRODUCTION_VARIANCE_CRITICAL_THRESHOLD;
  const oeeCritical =
    machine.oeePercent != null && machine.oeePercent < OEE_CRITICAL_THRESHOLD;
  const stoppageCritical = Boolean(machine.machineStoppage);

  const hasCritical =
    cycleCritical || productionCritical || oeeCritical || stoppageCritical;
  const hasWarning =
    !hasCritical &&
    (machine.machineStatus === "warning" ||
      machine.machineStatus === "critical");

  return {
    cycleTone: getAlertTone(cycleCritical),
    outputTone: getAlertTone(productionCritical),
    oeeTone: getAlertTone(oeeCritical),
    stoppageTone: getAlertTone(stoppageCritical),
    cardTone: getAlertTone(hasCritical, hasWarning),
    hasCritical,
    hasWarning,
  };
}

function formatPercent(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return `${Math.round(value)}%`;
}

function formatCycle(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return `${Math.round(value)}s`;
}

function formatDays(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return `${Math.round(value)}d`;
}

function formatHours(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return `${Math.round(value)}h`;
}

function formatRate(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return `${Math.round(value).toLocaleString()} u/hr`;
}

function formatQuantity(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return Math.round(value).toLocaleString();
}

function formatSnapshot(value?: string | null) {
  if (!value) {
    return "No snapshot";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "No snapshot";
  }
  return parsed.toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }
  return parsed.toLocaleDateString("en-ZA");
}

function getStatusMeta(status: ManufacturingMachineMetric["machineStatus"]) {
  return STATUS_STYLES[status ?? "running"] ?? STATUS_STYLES.running;
}

function getToneClass(tone: AlertTone) {
  if (tone === "critical") {
    return "text-error-base";
  }
  if (tone === "warning") {
    return "text-warning-base";
  }
  return "text-success-base";
}

function getCardRingClass(tone: AlertTone, fallback: string): string {
  if (tone === "critical") {
    return "ring-2 ring-error-light";
  }
  if (tone === "warning") {
    return "ring-2 ring-warning-light";
  }
  return fallback;
}

function getStatusBadgeStatus(tone: AlertTone) {
  if (tone === "critical") {
    return "failed" as const;
  }
  if (tone === "warning") {
    return "pending" as const;
  }
  return "completed" as const;
}

function getStatusBadgeLabel(tone: AlertTone, fallback: string) {
  if (tone === "critical") {
    return "Alert";
  }
  if (tone === "warning") {
    return "Watch";
  }
  return fallback;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone?: "neutral" | "success" | "warning" | "critical";
}) {
  let toneClasses = "text-primary-base bg-primary-lighter";
  if (tone === "success") {
    toneClasses = "text-success-base bg-success-lighter";
  } else if (tone === "warning") {
    toneClasses = "text-warning-base bg-warning-lighter";
  } else if (tone === "critical") {
    toneClasses = "text-error-base bg-error-lighter";
  }

  return (
    <div className="rounded-2xl bg-bg-white-0 p-4 ring-1 ring-stroke-soft-200 ring-inset">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg",
            toneClasses
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="text-paragraph-xs text-text-sub-600">{label}</p>
      <p className="mt-1 text-text-strong-950 text-title-h5">{value}</p>
    </div>
  );
}

export function ManufacturingDashboard({
  initialQuery,
  locations,
  machines,
}: ManufacturingDashboardProps) {
  const [selectedLocationId, setSelectedLocationId] = useState("all");
  const [query, setQuery] = useState(initialQuery);

  const filteredMachines = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return machines.filter((machine) => {
      const matchesLocation =
        selectedLocationId === "all" ||
        machine.locationId === selectedLocationId;
      if (!matchesLocation) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const searchable = [
        machine.name,
        machine.assetTag,
        machine.machineCode,
        machine.currentJobLabel,
        machine.moNumber,
        machine.locationName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [machines, query, selectedLocationId]);

  const summary = useMemo(() => {
    const evaluated = filteredMachines.map((machine) =>
      evaluateMachineAlerts(machine)
    );
    const running = evaluated.filter((status) => {
      if (status.hasCritical) {
        return false;
      }
      return !status.hasWarning;
    }).length;
    const warning = evaluated.filter((status) => status.hasWarning).length;
    const critical = evaluated.filter((status) => status.hasCritical).length;
    const stopped = filteredMachines.filter((m) => m.machineStoppage).length;
    const snapshots = filteredMachines
      .map((machine) => machine.lastSnapshotAt)
      .filter((value): value is string => Boolean(value))
      .map((value) => new Date(value))
      .filter((value) => !Number.isNaN(value.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    return {
      total: filteredMachines.length,
      running,
      warning,
      critical,
      stopped,
      lastSnapshotAt: snapshots[0]?.toISOString(),
    };
  }, [filteredMachines]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={RiToolsLine}
          label="Machines"
          value={summary.total}
        />
        <SummaryCard
          icon={RiPlayCircleLine}
          label="Running"
          tone="success"
          value={summary.running}
        />
        <SummaryCard
          icon={RiAlarmWarningLine}
          label="Warnings"
          tone="warning"
          value={summary.warning}
        />
        <SummaryCard
          icon={RiErrorWarningLine}
          label="Critical"
          tone="critical"
          value={summary.critical}
        />
        <SummaryCard
          icon={RiTimeLine}
          label="Last Snapshot"
          value={
            summary.lastSnapshotAt
              ? new Date(summary.lastSnapshotAt).toLocaleDateString("en-ZA", {
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-bg-white-0 p-4 ring-1 ring-stroke-soft-200 ring-inset md:flex-row md:items-center">
        <div className="flex-1">
          <label
            className="mb-1 block text-label-xs text-text-sub-600"
            htmlFor="manufacturing-search"
          >
            Search machine, tag, job, or MO
          </label>
          <input
            className="h-10 w-full rounded-10 border border-stroke-soft-200 bg-bg-white-0 px-3 text-paragraph-sm text-text-strong-950 outline-none transition focus:border-stroke-strong-950"
            id="manufacturing-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. F1 line or MO-2015"
            value={query}
          />
        </div>
        <div className="w-full md:w-72">
          <p className="mb-1 block text-label-xs text-text-sub-600">Location</p>
          <Select.Root
            onValueChange={setSelectedLocationId}
            value={selectedLocationId}
          >
            <Select.Trigger>
              <Select.Value placeholder="All locations" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All locations</Select.Item>
              {locations.map((location) => (
                <Select.Item key={location.id} value={location.id}>
                  {location.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      {/* <div className="rounded-xl bg-warning-lighter px-3 py-2 text-paragraph-xs text-warning-base">
        Rejects are currently not tracked in this dashboard (no source data yet).
      </div> */}

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {filteredMachines.map((machine) => {
          const statusMeta = getStatusMeta(machine.machineStatus);
          const StatusIcon = statusMeta.icon;
          const alertState = evaluateMachineAlerts(machine);
          const cycleDelta =
            machine.actualCycleTimeSec != null &&
            machine.targetCycleTimeSec != null
              ? machine.actualCycleTimeSec - machine.targetCycleTimeSec
              : null;

          return (
            <div
              className={cn(
                "rounded-2xl bg-bg-white-0 p-4 shadow-complex-8",
                getCardRingClass(alertState.cardTone, statusMeta.ringClass)
              )}
              key={machine.id}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-label-sm text-text-soft-400">
                    {machine.machineCode ?? machine.assetTag}
                  </p>
                  <h3 className="truncate text-text-strong-950 text-title-h6">
                    {machine.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-paragraph-xs text-text-sub-600">
                    <RiMapPin2Line className="size-3.5" />
                    {machine.locationName}
                  </p>
                </div>
                <StatusBadge.Root
                  status={getStatusBadgeStatus(alertState.cardTone)}
                  variant="light"
                >
                  <StatusIcon className="size-4" />
                  {getStatusBadgeLabel(alertState.cardTone, statusMeta.label)}
                </StatusBadge.Root>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-bg-weak-50 px-3 py-2">
                  <p className="text-paragraph-xs text-text-sub-600">OEE</p>
                  <p
                    className={cn(
                      "text-label-md",
                      getToneClass(alertState.oeeTone)
                    )}
                  >
                    {formatPercent(machine.oeePercent)}
                  </p>
                </div>
                <div className="rounded-xl bg-bg-weak-50 px-3 py-2">
                  <p className="text-paragraph-xs text-text-sub-600">
                    Cycle (T/A)
                  </p>
                  <p className="text-label-md text-text-strong-950">
                    {formatCycle(machine.targetCycleTimeSec)} /{" "}
                    {formatCycle(machine.actualCycleTimeSec)}
                  </p>
                </div>
                <div className="rounded-xl bg-bg-weak-50 px-3 py-2">
                  <p className="text-paragraph-xs text-text-sub-600">
                    Drift / Remain
                  </p>
                  <p className="text-label-md text-text-strong-950">
                    {formatDays(machine.driftDays)} /{" "}
                    {formatDays(machine.remainDays)}
                  </p>
                </div>
                <div className="rounded-xl bg-bg-weak-50 px-3 py-2">
                  <p className="text-paragraph-xs text-text-sub-600">
                    Cycle Delta
                  </p>
                  <p
                    className={cn(
                      "text-label-md",
                      cycleDelta == null && "text-text-soft-400",
                      cycleDelta != null &&
                        (cycleDelta > 0
                          ? "text-warning-base"
                          : "text-success-base")
                    )}
                  >
                    {cycleDelta == null ? "—" : `${Math.round(cycleDelta)}s`}
                  </p>
                </div>
                <div className="rounded-xl bg-bg-weak-50 px-3 py-2">
                  <p className="text-paragraph-xs text-text-sub-600">
                    Output (T/A)
                  </p>
                  <p className="text-label-md text-text-strong-950">
                    {formatRate(machine.targetOutputPerHour)} /{" "}
                    {formatRate(machine.actualOutputPerHour)}
                  </p>
                </div>
                <div className="rounded-xl bg-bg-weak-50 px-3 py-2">
                  <p className="text-paragraph-xs text-text-sub-600">
                    Variance (C/P)
                  </p>
                  <p className="text-label-md text-text-strong-950">
                    {formatPercent(machine.cycleVariancePercent)} /{" "}
                    {formatPercent(machine.productionVariancePercent)}
                  </p>
                  <p className="mt-0.5 text-paragraph-xs">
                    <span className={getToneClass(alertState.cycleTone)}>
                      {alertText("Cycle", alertState.cycleTone)}
                    </span>{" "}
                    <span className="text-text-soft-400">|</span>{" "}
                    <span className={getToneClass(alertState.outputTone)}>
                      {alertText("Output", alertState.outputTone)}
                    </span>
                  </p>
                </div>
                <div className="rounded-xl bg-bg-weak-50 px-3 py-2">
                  <p className="text-paragraph-xs text-text-sub-600">
                    Remain Qty / Day
                  </p>
                  <p className="text-label-md text-text-strong-950">
                    {formatQuantity(machine.remainQty)} /{" "}
                    {formatQuantity(machine.qtyPerDay)}
                  </p>
                </div>
                <div className="rounded-xl bg-bg-weak-50 px-3 py-2">
                  <p className="text-paragraph-xs text-text-sub-600">
                    Remain Hrs / End
                  </p>
                  <p className="text-label-md text-text-strong-950">
                    {formatHours(machine.remainHours)} /{" "}
                    {formatDate(machine.productionEndDate)}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <p className="line-clamp-1 text-paragraph-sm text-text-strong-950">
                  {machine.currentJobLabel ?? "No active job"}
                </p>
                <p className="text-paragraph-xs text-text-sub-600">
                  {machine.moNumber
                    ? `MO ${machine.moNumber}`
                    : "No MO assigned"}
                </p>
                <p className="text-paragraph-xs text-text-soft-400">
                  Snapshot: {formatSnapshot(machine.lastSnapshotAt)}
                </p>
                {machine.machineStoppage ? (
                  <p className="mt-1 flex items-start gap-1 text-error-base text-paragraph-xs">
                    <RiErrorWarningLine className="mt-0.5 size-3.5 shrink-0" />
                    {machine.stoppageReason || "Machine stoppage reported"}
                  </p>
                ) : (
                  <p className="mt-1 flex items-center gap-1 text-paragraph-xs text-success-base">
                    <RiCheckboxCircleLine className="size-3.5" />
                    No stoppage reported
                  </p>
                )}
                <div className="pt-1">
                  <Link
                    className="text-label-sm text-primary-base underline-offset-2 transition hover:underline"
                    href={`/assets/${machine.id}`}
                  >
                    Open machine detail
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMachines.length === 0 ? (
        <div className="rounded-2xl bg-bg-white-0 px-6 py-12 text-center ring-1 ring-stroke-soft-200 ring-inset">
          <p className="text-label-md text-text-strong-950">
            No machines match this filter
          </p>
          <p className="mt-1 text-paragraph-sm text-text-sub-600">
            Try a different location or search term.
          </p>
        </div>
      ) : null}
    </div>
  );
}
