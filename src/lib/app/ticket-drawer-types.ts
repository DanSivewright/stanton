import type { Ticket } from "@/payload-types";

export interface TicketDrawerRelation {
  id: string;
  label: string;
  href?: string;
  sublabel?: string | null;
}

export interface TicketDrawerActivity {
  id: string | null;
  kind: "comment" | "photo" | "completion" | "review";
  kindLabel: string;
  author: string;
  body: string | null;
  createdAt: string;
  photoCount: number;
}

export interface TicketDrawerMovement {
  id: string;
  reference: string | null;
  assetLabel: string;
  fromLabel: string;
  toLabel: string;
  movedAt: string;
  reason: string | null;
}

export interface TicketDrawerData {
  ticket: {
    id: string;
    ticketNumber: string | null;
    title: string;
    description: string | null;
    status: Ticket["status"];
    reviewStatus: Ticket["reviewStatus"];
    priority: Ticket["priority"];
    typeLabel: string;
    reportedAt: string;
    statusProgress: number;
    company: TicketDrawerRelation;
    location: TicketDrawerRelation;
    asset: TicketDrawerRelation | null;
    assignedTeam: TicketDrawerRelation | null;
    assignedTo: TicketDrawerRelation | null;
    reportedBy: TicketDrawerRelation;
  };
  activities: TicketDrawerActivity[];
  movements: TicketDrawerMovement[];
}
