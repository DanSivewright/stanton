"use client";

import {
  RiChat3Line,
  RiCheckboxCircleLine,
  RiEyeLine,
  RiSearchLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { Command } from "cmdk";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TicketDetailDrawer, TicketRowTrigger } from "@/components/app/TicketDetailDrawer";
import { TicketStatusBadge } from "@/components/app/TicketStatusBadge";
import * as Kbd from "@/components/ui/kbd";
import * as LinkButton from "@/components/ui/link-button";
import * as Modal from "@/components/ui/modal";
import * as SegmentedControl from "@/components/ui/segmented-control";
import { formatDate } from "@/lib/app/helpers";
import {
  filterHubActivitiesByPeriod,
  type HubActivityItem,
  type HubOverviewData,
} from "@/lib/app/hub-overview-types";
import { cn } from "@/utils/cn";

const ACTIVITY_ICONS: Record<string, RemixiconComponentType> = {
  comment: RiChat3Line,
  completion: RiCheckboxCircleLine,
  review: RiEyeLine,
};

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("en-ZA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function PanelCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-stroke-soft-200 ring-inset">
      {children}
    </div>
  );
}

function ActivitySearchDialog({
  activities,
  onOpenChange,
  open,
}: {
  activities: HubActivityItem[];
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
                  value={`${item.title} ${item.description} ${item.authorName} ${item.locationLabel}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.title}</span>
                    <span className="block truncate text-paragraph-xs text-text-sub-600">
                      {item.description}
                    </span>
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </Modal.Content>
    </Modal.Root>
  );
}

export function RecentActivitiesPanel({ data }: { data: HubOverviewData }) {
  const [period, setPeriod] = useState<"today" | "yesterday" | "week">("week");
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = useMemo(
    () => filterHubActivitiesByPeriod(data.activities, period),
    [data.activities, period]
  );

  return (
    <PanelCard>
      <div className="flex items-start justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
        <div>
          <p className="text-label-md text-text-strong-950">Recent Activities</p>
          <p className="mt-0.5 text-paragraph-xs text-text-sub-600">
            {data.activitiesToday} new {data.activitiesToday === 1 ? "activity" : "activities"} today
          </p>
        </div>
        <LinkButton.Root asChild size="medium" variant="gray">
          <Link href="/tickets">Details</Link>
        </LinkButton.Root>
      </div>

      <div className="space-y-4 px-5 py-4">
        <SegmentedControl.Root
          onValueChange={(value) => setPeriod(value as "today" | "yesterday" | "week")}
          value={period}
        >
          <SegmentedControl.List>
            <SegmentedControl.Trigger value="today">Today</SegmentedControl.Trigger>
            <SegmentedControl.Trigger value="yesterday">Yesterday</SegmentedControl.Trigger>
            <SegmentedControl.Trigger value="week">This Week</SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>

        <button
          className="flex w-full items-center gap-2 rounded-xl bg-bg-weak-50 px-3 py-2.5 text-left ring-1 ring-stroke-soft-200 ring-inset transition hover:bg-bg-soft-200"
          onClick={() => setSearchOpen(true)}
          type="button"
        >
          <RiSearchLine className="size-4 shrink-0 text-text-sub-600" />
          <span className="flex-1 text-paragraph-sm text-text-soft-400">Search...</span>
          <Kbd.Root>⌘K</Kbd.Root>
        </button>

        <div className="max-h-[400px] space-y-1 overflow-auto">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-paragraph-sm text-text-soft-400">
              No activity for this period.
            </p>
          ) : (
            filtered.map((item) => {
              const Icon = ACTIVITY_ICONS[item.kind] ?? RiChat3Line;
              return (
                <div className="rounded-xl px-2 py-3 transition hover:bg-bg-weak-50" key={item.id}>
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-weak-50 ring-1 ring-stroke-soft-200 ring-inset">
                      <Icon className="size-4 text-text-sub-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-label-sm text-text-strong-950">{item.title}</p>
                        <span className="shrink-0 text-paragraph-xs text-text-soft-400">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-paragraph-xs text-text-sub-600">
                        {item.description}
                      </p>
                      <p className="mt-1 text-paragraph-xs text-text-soft-400">
                        {item.authorName} · {item.locationLabel}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ActivitySearchDialog
        activities={data.activities}
        onOpenChange={setSearchOpen}
        open={searchOpen}
      />
    </PanelCard>
  );
}

export function RecentTicketsPanel({ data }: { data: HubOverviewData }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTicketId, setDrawerTicketId] = useState<string | null>(null);

  const openTicketDrawer = useCallback((ticketId: string) => {
    setDrawerTicketId(ticketId);
    setDrawerOpen(true);
  }, []);

  return (
    <>
      <PanelCard>
        <div className="flex items-center justify-between gap-3 border-stroke-soft-200 border-b px-5 py-4">
          <p className="text-label-md text-text-strong-950">Recent Tickets</p>
          <LinkButton.Root asChild size="medium" variant="gray">
            <Link href="/tickets">View all</Link>
          </LinkButton.Root>
        </div>
        <div className="divide-y divide-stroke-soft-200">
          {data.recentTickets.length === 0 ? (
            <p className="px-5 py-8 text-center text-paragraph-sm text-text-soft-400">No tickets yet</p>
          ) : (
            data.recentTickets.map((ticket) => (
              <div className="px-5 py-3" key={ticket.id}>
                <TicketRowTrigger
                  onOpen={() => openTicketDrawer(ticket.id)}
                  ticket={{
                    ticketNumber: ticket.ticketNumber,
                    title: ticket.title,
                  }}
                />
                <div className="mt-2 flex flex-wrap items-center gap-2 pl-0">
                  <TicketStatusBadge status={ticket.status} />
                  <span className="text-paragraph-xs text-text-soft-400">
                    {ticket.typeLabel} · {ticket.locationLabel}
                  </span>
                  <span className="text-paragraph-xs text-text-soft-400">
                    {formatDate(ticket.reportedAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </PanelCard>

      <TicketDetailDrawer
        onOpenChange={setDrawerOpen}
        open={drawerOpen}
        ticketId={drawerTicketId}
      />
    </>
  );
}
