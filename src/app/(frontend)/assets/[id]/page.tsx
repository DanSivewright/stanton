import {
  RiAlarmWarningLine,
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiMapPin2Line,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiPriceTag3Line,
  RiSettings3Line,
  RiTicketLine,
  RiTimeLine,
  RiToolsLine,
} from "@remixicon/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as Avatar from "@/components/ui/avatar";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as StatusBadge from "@/components/ui/status-badge";
import { formatDate, formatDateTime, relLabel } from "@/lib/app/helpers";
import { findById, findCollection } from "@/lib/app/queries";
import type { Asset, Ticket } from "@/payload-types";
import { cn } from "@/utils/cn";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_META = {
  running: {
    icon: RiPlayCircleLine,
    label: "Running",
    status: "completed" as const,
  },
  warning: {
    icon: RiAlarmWarningLine,
    label: "Warning",
    status: "pending" as const,
  },
  critical: {
    icon: RiErrorWarningLine,
    label: "Critical",
    status: "failed" as const,
  },
  stopped: {
    icon: RiPauseCircleLine,
    label: "Stopped",
    status: "disabled" as const,
  },
};

function formatPercent(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return `${Math.round(value)}%`;
}

function formatRate(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return `${Math.round(value).toLocaleString()} u/hr`;
}

function formatCycle(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return `${Math.round(value)}s`;
}

function formatValue(value?: number | null) {
  if (value == null) {
    return "—";
  }
  return Math.round(value).toLocaleString();
}

function isMachineAsset(asset: Asset) {
  return Boolean(
    asset.assetTag.startsWith("MFG-") ||
      asset.machineCode ||
      asset.machineStatus ||
      asset.oeePercent != null ||
      asset.targetCycleTimeSec != null
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200 ring-inset">
      <div className="mb-2 inline-flex size-7 items-center justify-center rounded-lg bg-bg-white-0 text-text-sub-600">
        <Icon className="size-4" />
      </div>
      <p className="text-paragraph-xs text-text-sub-600">{label}</p>
      <p className="mt-0.5 text-label-sm text-text-strong-950">{value}</p>
    </div>
  );
}

export default async function AssetDetailPage({ params }: PageProps) {
  const { id } = await params;
  const asset = await findById<Asset>("assets", id);

  if (!asset) {
    notFound();
  }

  const ticketsResult = await findCollection<Ticket>("tickets", {
    limit: 200,
    page: 1,
    sort: "-reportedAt",
    where: {
      asset: { equals: asset.id },
    },
  });
  const tickets = ticketsResult.docs;
  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open" || ticket.status === "in_progress"
  );
  const machine = isMachineAsset(asset);
  const machineStatus = asset.machineStatus ?? "running";
  const machineStatusMeta =
    STATUS_META[machineStatus as keyof typeof STATUS_META] ?? STATUS_META.running;
  const MachineStatusIcon = machineStatusMeta.icon;

  return (
    <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-col px-4 py-5 lg:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar.Root size="24">
            <RiToolsLine className="size-5 text-text-sub-600" />
          </Avatar.Root>
          <div>
            <Breadcrumb.Root className="w-fit items-center">
              <Breadcrumb.Item>
                <Link href="/assets">Assets</Link>
              </Breadcrumb.Item>
              <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
              <Breadcrumb.Item active>{asset.name}</Breadcrumb.Item>
            </Breadcrumb.Root>
            <p className="mt-1 text-paragraph-sm text-text-sub-600">
              {machine
                ? "Manufacturing machine detail and ticket view."
                : "Asset detail and linked maintenance tickets."}
            </p>
          </div>
        </div>
        <Link
          className="inline-flex items-center gap-1 text-label-sm text-text-sub-600 transition hover:text-text-strong-950"
          href="/manufacturing"
        >
          <RiArrowLeftLine className="size-4" />
          Back to Manufacturing
        </Link>
      </header>

      <section className="mb-6 rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-stroke-soft-200 ring-inset">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-label-sm text-text-soft-400">{asset.assetTag}</p>
            <h1 className="text-text-strong-950 text-title-h4">{asset.name}</h1>
            <p className="mt-1 flex items-center gap-1 text-paragraph-sm text-text-sub-600">
              <RiMapPin2Line className="size-4" />
              {relLabel(asset.location)}
            </p>
          </div>
          {machine ? (
            <StatusBadge.Root status={machineStatusMeta.status} variant="light">
              <MachineStatusIcon className="size-4" />
              {machineStatusMeta.label}
            </StatusBadge.Root>
          ) : (
            <StatusBadge.Root status="completed" variant="light">
              Active Asset
            </StatusBadge.Root>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DetailCard
            icon={RiPriceTag3Line}
            label="Category"
            value={relLabel(asset.category)}
          />
          <DetailCard
            icon={RiSettings3Line}
            label="Status"
            value={relLabel(asset.status)}
          />
          <DetailCard
            icon={RiCalendarLine}
            label="Created"
            value={formatDate(asset.createdAt)}
          />
          <DetailCard
            icon={RiTimeLine}
            label="Last Updated"
            value={formatDateTime(asset.updatedAt)}
          />
        </div>
      </section>

      {machine ? (
        <section className="mb-6 rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-stroke-soft-200 ring-inset">
          <h2 className="mb-3 text-text-strong-950 text-title-h6">
            Manufacturing Overview
          </h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <DetailCard
              icon={RiToolsLine}
              label="Machine Code"
              value={asset.machineCode ?? "—"}
            />
            <DetailCard
              icon={RiSettings3Line}
              label="Current Job"
              value={asset.currentJobLabel ?? "No active job"}
            />
            <DetailCard
              icon={RiPriceTag3Line}
              label="MO Number"
              value={asset.moNumber ?? "—"}
            />
            <DetailCard
              icon={RiTimeLine}
              label="Last Snapshot"
              value={formatDateTime(asset.lastSnapshotAt)}
            />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <DetailCard
              icon={RiTimeLine}
              label="Cycle (Target / Actual)"
              value={`${formatCycle(asset.targetCycleTimeSec)} / ${formatCycle(asset.actualCycleTimeSec)}`}
            />
            <DetailCard
              icon={RiToolsLine}
              label="Output (Target / Actual)"
              value={`${formatRate(asset.targetOutputPerHour)} / ${formatRate(asset.actualOutputPerHour)}`}
            />
            <DetailCard
              icon={RiAlarmWarningLine}
              label="Variance (Cycle / Production)"
              value={`${formatPercent(asset.cycleVariancePercent)} / ${formatPercent(asset.productionVariancePercent)}`}
            />
            <DetailCard
              icon={RiCheckboxCircleLine}
              label="OEE"
              value={formatPercent(asset.oeePercent)}
            />
            <DetailCard
              icon={RiCalendarLine}
              label="Drift / Remaining Days"
              value={`${formatValue(asset.driftDays)} / ${formatValue(asset.remainDays)}`}
            />
            <DetailCard
              icon={RiCalendarLine}
              label="Remain Qty / Hours"
              value={`${formatValue(asset.remainQty)} / ${formatValue(asset.remainHours)}`}
            />
          </div>

          <div
            className={cn(
              "mt-4 rounded-xl px-3 py-2 text-paragraph-sm",
              asset.machineStoppage
                ? "bg-error-lighter text-error-base"
                : "bg-success-lighter text-success-base"
            )}
          >
            {asset.machineStoppage ? (
              <span className="flex items-start gap-1">
                <RiErrorWarningLine className="mt-0.5 size-4 shrink-0" />
                {asset.stoppageReason || "Machine stoppage reported."}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <RiCheckboxCircleLine className="size-4" />
                No stoppage reported.
              </span>
            )}
          </div>
        </section>
      ) : (
        <section className="mb-6 rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-stroke-soft-200 ring-inset">
          <h2 className="mb-2 text-text-strong-950 text-title-h6">Asset Metadata</h2>
          <p className="text-paragraph-sm text-text-sub-600">
            This asset does not have manufacturing machine metrics. Core asset
            details and tickets are shown below.
          </p>
        </section>
      )}

      <section className="rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-stroke-soft-200 ring-inset">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-text-strong-950 text-title-h6">Linked Tickets</h2>
          <StatusBadge.Root
            status={openTickets.length > 0 ? "pending" : "completed"}
            variant="light"
          >
            <RiTicketLine className="size-4" />
            {openTickets.length} open
          </StatusBadge.Root>
        </div>

        {tickets.length === 0 ? (
          <p className="rounded-xl bg-bg-weak-50 px-4 py-6 text-center text-paragraph-sm text-text-sub-600">
            No tickets linked to this asset yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl ring-1 ring-stroke-soft-200 ring-inset">
            <table className="w-full text-left">
              <thead className="bg-bg-weak-50 text-label-xs text-text-sub-600 uppercase">
                <tr>
                  <th className="px-3 py-2">Ticket</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Priority</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Reported</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr className="border-stroke-soft-200 border-t" key={ticket.id}>
                    <td className="px-3 py-2 font-medium text-text-strong-950">
                      {ticket.ticketNumber ?? ticket.id}
                    </td>
                    <td className="px-3 py-2 text-paragraph-sm text-text-sub-600">
                      {ticket.title}
                    </td>
                    <td className="px-3 py-2 text-paragraph-sm text-text-sub-600 capitalize">
                      {ticket.priority}
                    </td>
                    <td className="px-3 py-2 text-paragraph-sm text-text-sub-600">
                      {ticket.status.replaceAll("_", " ")}
                    </td>
                    <td className="px-3 py-2 text-paragraph-sm text-text-sub-600">
                      {formatDateTime(ticket.reportedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
