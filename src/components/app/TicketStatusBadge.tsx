import * as Badge from "@/components/ui/badge";
import { getTicketStatusMeta } from "@/lib/app/ticket-status-badge";
import type { Ticket } from "@/payload-types";

interface TicketStatusBadgeProps {
  status: Ticket["status"];
  size?: "small" | "medium";
}

export function TicketStatusBadge({
  status,
  size = "small",
}: TicketStatusBadgeProps) {
  const meta = getTicketStatusMeta(status);
  const Icon = meta.icon;

  return (
    <Badge.Root color={meta.color} size={size} variant="lighter">
      <Badge.Icon as={Icon} />
      {meta.label}
    </Badge.Root>
  );
}
