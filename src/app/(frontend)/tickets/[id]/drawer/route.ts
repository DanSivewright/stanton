import { NextResponse } from "next/server";
import { getTicketDrawerData } from "@/lib/app/ticket-drawer";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const data = await getTicketDrawerData(id);

  if (!data) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
