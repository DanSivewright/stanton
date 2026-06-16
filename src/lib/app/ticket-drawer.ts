import type { Route } from "next";
import type { Where } from "payload";
import { relId, relLabel } from "@/lib/app/helpers";
import type {
  TicketDrawerData,
  TicketDrawerRelation,
} from "@/lib/app/ticket-drawer-types";
import { findById, findCollection } from "@/lib/app/queries";
import type { AssetMovement, Ticket } from "@/payload-types";

const ACTIVITY_KIND_LABELS: Record<string, string> = {
  comment: "Comment",
  photo: "Photo",
  completion: "Work completed",
  review: "Review",
};

const STATUS_PROGRESS: Record<Ticket["status"], number> = {
  open: 25,
  in_progress: 65,
  completed: 100,
  cancelled: 10,
};

function relation(
  value: Parameters<typeof relId>[0],
  label: string,
  href?: string,
  sublabel?: string | null
): TicketDrawerRelation | null {
  const id = relId(value);
  if (!id) {
    return null;
  }
  return { id, label, href, sublabel };
}

function requireRelation(
  value: Parameters<typeof relId>[0],
  label: string,
  href?: string,
  sublabel?: string | null
): TicketDrawerRelation {
  return (
    relation(value, label, href, sublabel) ?? {
      id: "unknown",
      label: label || "—",
      href,
      sublabel,
    }
  );
}

function getMovementsWhere(
  assetId?: string,
  locationId?: string
): Where | undefined {
  if (assetId) {
    return { asset: { equals: assetId } };
  }
  if (locationId) {
    return {
      or: [
        { fromLocation: { equals: locationId } },
        { toLocation: { equals: locationId } },
      ],
    };
  }
  return;
}

export async function getTicketDrawerData(
  ticketId: string
): Promise<TicketDrawerData | null> {
  const ticket = await findById<Ticket>("tickets", ticketId);
  if (!ticket) {
    return null;
  }

  const companyId = relId(ticket.company);
  const locationId = relId(ticket.location);
  const assetId = relId(ticket.asset);
  const movementsWhere = getMovementsWhere(assetId, locationId);

  const movementsResult = movementsWhere
    ? await findCollection<AssetMovement>("asset-movements", {
        where: movementsWhere,
        sort: "-movedAt",
        limit: 12,
      })
    : { docs: [] as AssetMovement[] };

  const activities = [...(ticket.activity ?? [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((entry) => ({
      id: entry.id ?? null,
      kind: entry.kind,
      kindLabel: ACTIVITY_KIND_LABELS[entry.kind] ?? entry.kind,
      author: relLabel(entry.author),
      body: entry.body ?? null,
      createdAt: entry.createdAt,
      photoCount: entry.photos?.length ?? 0,
    }));

  const assignedTo =
    typeof ticket.assignedTo === "object" && ticket.assignedTo
      ? relation(
          ticket.assignedTo,
          relLabel(ticket.assignedTo),
          undefined,
          ticket.assignedTo.jobTitle ?? ticket.assignedTo.email
        )
      : relation(ticket.assignedTo, relLabel(ticket.assignedTo));

  const companyHref = companyId
    ? (`/companies/${companyId}` as Route)
    : undefined;
  const locationHref = locationId
    ? (`/locations/${locationId}` as Route)
    : undefined;

  return {
    ticket: {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber ?? null,
      title: ticket.title,
      description: ticket.description ?? null,
      status: ticket.status,
      reviewStatus: ticket.reviewStatus,
      priority: ticket.priority,
      typeLabel: relLabel(ticket.type),
      reportedAt: ticket.reportedAt,
      statusProgress: STATUS_PROGRESS[ticket.status],
      company: requireRelation(
        ticket.company,
        relLabel(ticket.company),
        companyHref
      ),
      location: requireRelation(
        ticket.location,
        relLabel(ticket.location),
        locationHref
      ),
      asset: assetId
        ? relation(
            ticket.asset,
            relLabel(ticket.asset),
            undefined,
            typeof ticket.asset === "object" && ticket.asset
              ? (ticket.asset.assetTag ?? null)
              : null
          )
        : null,
      assignedTeam: relation(
        ticket.assignedTeam,
        relLabel(ticket.assignedTeam)
      ),
      assignedTo,
      reportedBy: requireRelation(
        ticket.reportedBy,
        relLabel(ticket.reportedBy)
      ),
    },
    activities,
    movements: movementsResult.docs.map((movement) => ({
      id: movement.id,
      reference: movement.reference ?? null,
      assetLabel: relLabel(movement.asset),
      fromLabel: relLabel(movement.fromLocation),
      toLabel: relLabel(movement.toLocation),
      movedAt: movement.movedAt,
      reason: movement.reason ?? null,
    })),
  };
}
