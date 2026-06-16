import { Suspense } from "react";
import type { Where } from "payload";
import { CollectionToolbar } from "@/components/app/CollectionToolbar";
import { MaintenanceTeamsDataTable } from "@/components/app/MaintenanceTeamsDataTable";
import { NAME_SORT_OPTIONS } from "@/lib/app/company-filters";
import {
  type ListSearchParams,
  parseListParams,
} from "@/lib/app/pagination";
import { fetchMaintenanceTeamsListData } from "@/lib/app/teams-list";

interface MaintenanceTeamsListViewProps {
  placeholder?: string;
  searchParams: ListSearchParams;
  where?: Where;
}

function TableFallback() {
  return (
    <div className="pb-8">
      <div className="h-48 animate-pulse rounded-xl bg-bg-weak-50" />
    </div>
  );
}

export async function MaintenanceTeamsListView({
  where,
  searchParams,
  placeholder = "Search maintenance teams...",
}: MaintenanceTeamsListViewProps) {
  const listParams = parseListParams(searchParams);
  const { result, ticketTypes, ticketCountsByTeam, pageCount, currentPage } =
    await fetchMaintenanceTeamsListData(where, listParams);

  return (
    <>
      <Suspense
        fallback={
          <div className="h-12 animate-pulse rounded-lg bg-bg-weak-50" />
        }
      >
        <CollectionToolbar
          defaultLimit={listParams.limit}
          defaultQuery={listParams.query}
          defaultSort={listParams.sort}
          placeholder={placeholder}
          sortOptions={NAME_SORT_OPTIONS}
        />
      </Suspense>

      <Suspense fallback={<TableFallback />}>
        <MaintenanceTeamsDataTable
          data={result.docs}
          limit={listParams.limit}
          page={currentPage}
          pageCount={pageCount}
          ticketCountsByTeam={ticketCountsByTeam}
          ticketTypes={ticketTypes}
          totalDocs={result.totalDocs}
        />
      </Suspense>
    </>
  );
}
