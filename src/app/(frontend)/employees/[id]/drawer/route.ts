import { NextResponse } from "next/server";
import { getEmployeeDrawerData } from "@/lib/app/employee-drawer";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const data = await getEmployeeDrawerData(id);

  if (!data) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
