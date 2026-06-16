import { NextResponse } from "next/server";
import { getTeamDrawerData } from "@/lib/app/team-drawer";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const data = await getTeamDrawerData(id);

  if (!data) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
