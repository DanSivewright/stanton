"use client";

import {
  RiArrowRightSLine,
  RiBuilding2Line,
  RiChat3Line,
  RiCheckboxCircleLine,
  RiExchangeLine,
  RiEyeLine,
  RiImageLine,
  RiMapPinLine,
  RiTeamLine,
  RiTicketLine,
  RiUserLine,
} from "@remixicon/react";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { TicketStatusBadge } from "@/components/app/TicketStatusBadge";
import * as Avatar from "@/components/ui/avatar";
import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as CompactButton from "@/components/ui/compact-button";
import * as Divider from "@/components/ui/divider";
import * as Drawer from "@/components/ui/drawer";
import * as ProgressCircle from "@/components/ui/progress-circle";
import * as TabMenu from "@/components/ui/tab-menu-horizontal";
import {
  formatDate,
  formatDateTime,
  initials,
  priorityColor,
} from "@/lib/app/helpers";
import type {
  TicketDrawerActivity,
  TicketDrawerData,
  TicketDrawerMovement,
  TicketDrawerRelation,
} from "@/lib/app/ticket-drawer-types";
import { getTicketStatusMeta } from "@/lib/app/ticket-status-badge";
import type { Ticket } from "@/payload-types";
import { cn } from "@/utils/cn";

const REVIEW_META: Record<
  Ticket["reviewStatus"],
  { label: string; color: "gray" | "yellow" | "green" | "red" }
> = {
  none: { label: "No review", color: "gray" },
  pending: { label: "Review pending", color: "yellow" },
  verified: { label: "Verified", color: "green" },
  rejected: { label: "Rejected", color: "red" },
};

const ACTIVITY_ICONS = {
  comment: RiChat3Line,
  photo: RiImageLine,
  completion: RiCheckboxCircleLine,
  review: RiEyeLine,
} as const;

const ACTIVITY_COLORS = {
  comment: "purple",
  photo: "blue",
  completion: "green",
  review: "orange",
} as const;

interface TicketDetailDrawerProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  ticketId: string | null;
}

function DetailField({
  href,
  label,
  value,
}: {
  href?: string;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <div className="text-subheading-xs text-text-soft-400 uppercase">
        {label}
      </div>
      {href ? (
        <Link
          className="text-label-sm text-primary-base transition hover:opacity-80"
          href={href as Route}
        >
          {value}
        </Link>
      ) : (
        <div className="text-label-sm text-text-strong-950">{value}</div>
      )}
    </div>
  );
}

function AssignmentCard({
  emptyLabel,
  icon: Icon,
  relation,
  tone,
}: {
  emptyLabel: string;
  icon: typeof RiUserLine;
  relation: TicketDrawerRelation | null;
  tone: "blue" | "purple";
}) {
  const label = relation?.label ?? emptyLabel;
  const sublabel = relation?.sublabel;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-bg-weak-50 p-3 ring-1 ring-stroke-soft-200 ring-inset">
      <Avatar.Root color={tone} size="40">
        {relation ? initials(label) : <Icon className="size-5" />}
      </Avatar.Root>
      <div className="min-w-0 flex-1">
        <div className="truncate text-label-sm text-text-strong-950">
          {label}
        </div>
        <div className="truncate text-paragraph-xs text-text-sub-600">
          {sublabel ?? (relation ? "Assigned" : "Unassigned")}
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ entry }: { entry: TicketDrawerActivity }) {
  const Icon = ACTIVITY_ICONS[entry.kind] ?? RiChat3Line;
  const color = ACTIVITY_COLORS[entry.kind] ?? "purple";

  return (
    <div className="flex w-full items-start gap-3 rounded-xl py-2">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          color === "purple" && "bg-feature-lighter",
          color === "blue" && "bg-information-lighter",
          color === "green" && "bg-success-lighter",
          color === "orange" && "bg-warning-lighter"
        )}
      >
        <Icon
          className={cn(
            "size-5",
            color === "purple" && "text-feature-base",
            color === "blue" && "text-information-base",
            color === "green" && "text-success-base",
            color === "orange" && "text-warning-base"
          )}
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-label-sm text-text-strong-950">
            {entry.author}
          </span>
          <Badge.Root color={color} size="small" variant="lighter">
            {entry.kindLabel}
          </Badge.Root>
        </div>
        {entry.body ? (
          <p className="line-clamp-2 text-paragraph-xs text-text-sub-600">
            {entry.body}
          </p>
        ) : null}
        {entry.photoCount > 0 ? (
          <p className="text-paragraph-xs text-text-soft-400">
            {entry.photoCount} photo{entry.photoCount === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>
      <div className="shrink-0 text-right text-paragraph-xs text-text-sub-600">
        {formatDateTime(entry.createdAt)}
      </div>
    </div>
  );
}

function MovementRow({ movement }: { movement: TicketDrawerMovement }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl py-2">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-stable-lighter">
        <RiExchangeLine className="size-5 text-stable-base" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="text-label-sm text-text-strong-950">
          {movement.assetLabel}
        </div>
        <div className="truncate text-paragraph-xs text-text-sub-600">
          {movement.fromLabel} → {movement.toLabel}
        </div>
        {movement.reason ? (
          <div className="truncate text-paragraph-xs text-text-soft-400">
            {movement.reason}
          </div>
        ) : null}
      </div>
      <div className="shrink-0 space-y-1 text-right">
        <div className="font-mono text-paragraph-xs text-text-sub-600">
          {movement.reference ?? "—"}
        </div>
        <div className="text-paragraph-xs text-text-soft-400">
          {formatDate(movement.movedAt)}
        </div>
      </div>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-4 p-5">
      <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-bg-weak-50" />
      <div className="mx-auto h-5 w-48 animate-pulse rounded bg-bg-weak-50" />
      <div className="mx-auto h-4 w-32 animate-pulse rounded bg-bg-weak-50" />
      <div className="h-24 animate-pulse rounded-xl bg-bg-weak-50" />
      <div className="h-24 animate-pulse rounded-xl bg-bg-weak-50" />
    </div>
  );
}

function TicketDrawerContent({ data }: { data: TicketDrawerData }) {
  const { ticket } = data;
  const statusMeta = getTicketStatusMeta(ticket.status);
  const reviewMeta = REVIEW_META[ticket.reviewStatus];
  const StatusIcon = statusMeta.icon;

  return (
    <TabMenu.Root defaultValue="details">
      <div className="flex flex-col items-center gap-4 border-stroke-soft-200 border-b px-5 py-6">
        <div className="relative">
          <ProgressCircle.Root size="72" value={ticket.statusProgress}>
            <StatusIcon className="size-6 text-primary-base" />
          </ProgressCircle.Root>
        </div>
        <div className="space-y-1 text-center">
          <div className="text-label-lg text-text-strong-950">{ticket.title}</div>
          <div className="font-mono text-paragraph-sm text-text-sub-600">
            {ticket.ticketNumber ?? "—"}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <TicketStatusBadge status={ticket.status} />
          <Badge.Root color={reviewMeta.color} size="small" variant="lighter">
            {reviewMeta.label}
          </Badge.Root>
          <Badge.Root color="gray" size="small" variant="lighter">
            <span
              className="mr-1 inline-block size-1.5 rounded-full"
              style={{ backgroundColor: priorityColor(ticket.priority) }}
            />
            <span className="capitalize">{ticket.priority}</span>
          </Badge.Root>
        </div>
      </div>

      <TabMenu.List className="px-5">
        <TabMenu.Trigger value="details">
          <TabMenu.Icon as={RiTicketLine} />
          Details
        </TabMenu.Trigger>
        <TabMenu.Trigger value="activity">
          <TabMenu.Icon as={RiChat3Line} />
          Activity
        </TabMenu.Trigger>
        <TabMenu.Trigger value="movements">
          <TabMenu.Icon as={RiExchangeLine} />
          Movements
        </TabMenu.Trigger>
      </TabMenu.List>

      <TabMenu.Content value="details">
        {ticket.description ? (
          <>
            <div className="px-5 py-4">
              <p className="whitespace-pre-wrap text-paragraph-sm text-text-sub-600 leading-relaxed">
                {ticket.description}
              </p>
            </div>
            <Divider.Root variant="line-spacing" />
          </>
        ) : null}

        <Divider.Root className="px-5" variant="solid-text">
          Assignment
        </Divider.Root>
        <div className="space-y-3 p-5">
          <AssignmentCard
            emptyLabel="No team assigned"
            icon={RiTeamLine}
            relation={ticket.assignedTeam}
            tone="purple"
          />
          <AssignmentCard
            emptyLabel="No assignee"
            icon={RiUserLine}
            relation={ticket.assignedTo}
            tone="blue"
          />
        </div>

        <Divider.Root className="px-5" variant="solid-text">
          Context
        </Divider.Root>
        <div className="space-y-3 p-5">
          <DetailField
            href={ticket.company.href}
            label="Company"
            value={ticket.company.label}
          />
          <Divider.Root variant="line-spacing" />
          <DetailField
            href={ticket.location.href}
            label="Location"
            value={ticket.location.label}
          />
          {ticket.asset ? (
            <>
              <Divider.Root variant="line-spacing" />
              <DetailField
                label="Asset"
                value={
                  ticket.asset.sublabel
                    ? `${ticket.asset.label} · ${ticket.asset.sublabel}`
                    : ticket.asset.label
                }
              />
            </>
          ) : null}
          <Divider.Root variant="line-spacing" />
          <DetailField
            label="Ticket type"
            value={ticket.typeLabel}
          />
          <Divider.Root variant="line-spacing" />
          <DetailField
            label="Reported by"
            value={ticket.reportedBy.label}
          />
          <Divider.Root variant="line-spacing" />
          <DetailField
            label="Reported at"
            value={formatDateTime(ticket.reportedAt)}
          />
        </div>
      </TabMenu.Content>

      <TabMenu.Content value="activity">
        <div className="space-y-1 px-5 py-3.5">
          {data.activities.length === 0 ? (
            <p className="py-8 text-center text-paragraph-sm text-text-soft-400">
              No activity on this ticket yet.
            </p>
          ) : (
            data.activities.map((entry) => (
              <ActivityRow entry={entry} key={entry.id ?? entry.createdAt} />
            ))
          )}
        </div>
      </TabMenu.Content>

      <TabMenu.Content value="movements">
        <div className="space-y-1 px-5 py-3.5">
          {data.movements.length === 0 ? (
            <p className="py-8 text-center text-paragraph-sm text-text-soft-400">
              No asset movements linked to this ticket.
            </p>
          ) : (
            data.movements.map((movement) => (
              <MovementRow key={movement.id} movement={movement} />
            ))
          )}
        </div>
      </TabMenu.Content>
    </TabMenu.Root>
  );
}

export function TicketDetailDrawer({
  onOpenChange,
  open,
  ticketId,
}: TicketDetailDrawerProps) {
  const [data, setData] = useState<TicketDrawerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!ticketId) {
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/tickets/${encodeURIComponent(ticketId)}/drawer`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load ticket details.");
        }
        return response.json() as Promise<TicketDrawerData>;
      })
      .then((next) => {
        setData(next);
      })
      .catch((fetchError: unknown) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }
        setError("Could not load ticket details.");
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [open, ticketId]);

  return (
    <Drawer.Root onOpenChange={onOpenChange} open={open}>
      <Drawer.Content className="max-w-[440px]">
        <Drawer.Header className="border-stroke-soft-200 border-b">
          <Drawer.Title>Ticket details</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          {loading ? <DrawerSkeleton /> : null}
          {!loading && error ? (
            <p className="p-5 text-error-base text-paragraph-sm">{error}</p>
          ) : null}
          {!loading && data ? <TicketDrawerContent data={data} /> : null}
        </Drawer.Body>
        {data ? (
          <Drawer.Footer className="border-stroke-soft-200 border-t">
            {data.ticket.location.href ? (
              <Button.Root
                asChild
                className="w-full"
                mode="stroke"
                size="medium"
                variant="neutral"
              >
                <Link href={data.ticket.location.href as Route}>
                  <Button.Icon as={RiMapPinLine} />
                  View location
                </Link>
              </Button.Root>
            ) : null}
            {data.ticket.company.href ? (
              <Button.Root
                asChild
                className="w-full"
                mode="stroke"
                size="medium"
                variant="neutral"
              >
                <Link href={data.ticket.company.href as Route}>
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

export function TicketRowTrigger({
  onOpen,
  ticket,
}: {
  onOpen: () => void;
  ticket: Pick<Ticket, "title" | "ticketNumber">;
}) {
  return (
    <button
      className="group min-w-0 text-left transition duration-200 ease-out hover:opacity-80"
      onClick={onOpen}
      type="button"
    >
      <div className="flex items-center gap-1">
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-text-strong-950 group-hover:text-primary-base">
            {ticket.title}
          </div>
          <div className="truncate font-mono text-paragraph-xs text-text-sub-600">
            {ticket.ticketNumber ?? "—"}
          </div>
        </div>
        <CompactButton.Root
          className="shrink-0 opacity-0 transition group-hover:opacity-100"
          size="medium"
          variant="ghost"
        >
          <CompactButton.Icon as={RiArrowRightSLine} />
        </CompactButton.Root>
      </div>
    </button>
  );
}
