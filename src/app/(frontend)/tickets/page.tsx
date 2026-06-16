import config from "@payload-config";
import { RiArrowRightSLine, RiSearchLine, RiSettingsLine, RiTicketLine } from "@remixicon/react";
import { getPayload, type Where } from "payload";
import { Suspense } from "react";
import { DottedRule } from "@/components/app/DottedRule";
import { TicketsInsights } from "@/components/app/PortfolioRouteInsights";
import { TicketsListView } from "@/components/app/TicketsListView";
import * as Avatar from "@/components/ui/avatar";
import * as Breadcrumb from "@/components/ui/breadcrumb";
import * as Button from "@/components/ui/button";
import type { Ticket } from "@/payload-types";

interface PageProps {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function TicketsPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config });
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const where: Where | undefined = query
    ? {
        or: [{ title: { contains: query } }, { ticketNumber: { contains: query } }],
      }
    : undefined;

  const ticketsResult = await payload.find({
    collection: "tickets",
    pagination: false,
    depth: 1,
    where,
    overrideAccess: true,
  });

  const tickets = ticketsResult.docs as Ticket[];
  const openCount = tickets.filter((ticket) => ticket.status === "open").length;
  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "in_progress"
  ).length;
  const closedCount = tickets.filter((ticket) => ticket.status === "completed").length;
  const pendingReviewCount = tickets.filter(
    (ticket) => ticket.reviewStatus === "pending"
  ).length;

  const byStatus = [
    { label: "Open", value: openCount },
    { label: "In Progress", value: inProgressCount },
    { label: "Completed", value: closedCount },
    {
      label: "Cancelled",
      value: tickets.filter((ticket) => ticket.status === "cancelled").length,
    },
  ].filter((item) => item.value > 0);

  const priorityOrder = ["urgent", "high", "medium", "low"] as const;
  const byPriority = priorityOrder.map((priority) => ({
    label: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: tickets.filter((ticket) => ticket.priority === priority).length,
  }));

  const stats = [
    { label: "Total tickets", value: tickets.length },
    {
      label: "Open + in progress",
      value: openCount + inProgressCount,
      meta: tickets.length === 0 ? "0%" : `${Math.round(((openCount + inProgressCount) / tickets.length) * 100)}%`,
    },
    { label: "Closed tickets", value: closedCount },
    { label: "Pending review", value: pendingReviewCount },
  ];

  return (
    <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-col">
      <header className="flex min-h-[88px] w-full flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:gap-3 lg:px-8">
        <div className="flex flex-1 gap-4 lg:gap-3.5">
          <Avatar.Root size="24">
            <RiTicketLine className="size-5 text-text-sub-600" />
          </Avatar.Root>
          <Breadcrumb.Root className="w-fit items-center">
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
            <Breadcrumb.Item active>Tickets</Breadcrumb.Item>
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
        <TicketsInsights byPriority={byPriority} byStatus={byStatus} stats={stats} />
        <DottedRule />
        <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-bg-weak-50" />}>
          <TicketsListView searchParams={params} where={where} />
        </Suspense>
      </div>
    </div>
  );
}
