import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTicketLine,
  RiToolsLine,
} from "@remixicon/react";
import type { TicketStatus } from "@/lib/constants/ticketStatuses";
import { TICKET_STATUSES } from "@/lib/constants/ticketStatuses";
import type { Ticket } from "@/payload-types";

export type TicketStatusBadgeColor =
  | "gray"
  | "blue"
  | "orange"
  | "red"
  | "green"
  | "yellow"
  | "purple"
  | "sky"
  | "pink"
  | "teal";

export interface TicketStatusMeta {
  color: TicketStatusBadgeColor;
  icon: RemixiconComponentType;
  label: string;
}

export const TICKET_STATUS_META: Record<TicketStatus, TicketStatusMeta> = {
  open: { label: "Open", color: "blue", icon: RiTicketLine },
  in_progress: { label: "In progress", color: "orange", icon: RiToolsLine },
  completed: { label: "Completed", color: "green", icon: RiCheckboxCircleLine },
  cancelled: { label: "Cancelled", color: "gray", icon: RiCloseCircleLine },
};

const FALLBACK_STATUS_META: TicketStatusMeta = {
  label: "Unknown",
  color: "gray",
  icon: RiTicketLine,
};

export function getTicketStatusMeta(
  status: Ticket["status"]
): TicketStatusMeta {
  if (TICKET_STATUSES.includes(status)) {
    return TICKET_STATUS_META[status];
  }
  return { ...FALLBACK_STATUS_META, label: status.replace(/_/g, " ") };
}
