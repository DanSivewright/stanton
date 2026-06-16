import type { Where } from "payload";
import {
  findCollection,
  getLocationTicketCountsByType,
} from "@/lib/app/queries";
import type { Location, TicketType } from "@/payload-types";
import type { parseListParams } from "@/lib/app/pagination";

export async function fetchLocationsListData(
  where: Where | undefined,
  listParams: ReturnType<typeof parseListParams>
) {
  const [result, ticketTypesResult] = await Promise.all([
    findCollection<Location>("locations", {
      page: listParams.page,
      limit: listParams.limit,
      sort: listParams.sort,
      where,
      joins: {
        assets: {
          count: true,
          limit: 0,
        },
      },
    }),
    findCollection<TicketType>("ticket-types", {
      limit: 100,
      sort: "name",
    }),
  ]);

  const ticketCountsByLocation = await getLocationTicketCountsByType(
    result.docs.map((location) => location.id)
  );

  const pageCount = Math.max(result.totalPages ?? 1, 1);
  const currentPage = Math.min(result.page ?? listParams.page, pageCount);

  return {
    result,
    ticketTypes: ticketTypesResult.docs,
    ticketCountsByLocation,
    pageCount,
    currentPage,
  };
}
