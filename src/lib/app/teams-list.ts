import type { Where } from "payload";
import {
  findCollection,
  getTeamTicketCountsByType,
} from "@/lib/app/queries";
import type { MaintenanceTeam, TicketType } from "@/payload-types";
import type { parseListParams } from "@/lib/app/pagination";

export async function fetchMaintenanceTeamsListData(
  where: Where | undefined,
  listParams: ReturnType<typeof parseListParams>
) {
  const [result, ticketTypesResult] = await Promise.all([
    findCollection<MaintenanceTeam>("maintenance-teams", {
      page: listParams.page,
      limit: listParams.limit,
      sort: listParams.sort,
      where,
    }),
    findCollection<TicketType>("ticket-types", {
      limit: 100,
      sort: "name",
    }),
  ]);

  const ticketCountsByTeam = await getTeamTicketCountsByType(
    result.docs.map((team) => team.id)
  );

  const pageCount = Math.max(result.totalPages ?? 1, 1);
  const currentPage = Math.min(result.page ?? listParams.page, pageCount);

  return {
    result,
    ticketTypes: ticketTypesResult.docs,
    ticketCountsByTeam,
    pageCount,
    currentPage,
  };
}
