import { Suspense } from "react";
import type { Where } from "payload";
import { CollectionToolbar } from "@/components/mockups/mr/CollectionToolbar";
import { LocationsDataTable } from "@/components/mockups/mr/LocationsDataTable";
import { NAME_SORT_OPTIONS } from "@/lib/mockups/mr/company-filters";
import {
  type ListSearchParams,
  parseListParams,
} from "@/lib/mockups/mr/pagination";
import { fetchLocationsListData } from "@/lib/mockups/mr/locations-list";

interface LocationsListViewProps {
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

export async function LocationsListView({
  where,
  searchParams,
  placeholder = "Search locations...",
}: LocationsListViewProps) {
  const listParams = parseListParams(searchParams);
  const { result, ticketTypes, ticketCountsByLocation, pageCount, currentPage } =
    await fetchLocationsListData(where, listParams);

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
        <LocationsDataTable
          data={result.docs}
          limit={listParams.limit}
          page={currentPage}
          pageCount={pageCount}
          ticketCountsByLocation={ticketCountsByLocation}
          ticketTypes={ticketTypes}
          totalDocs={result.totalDocs}
        />
      </Suspense>
    </>
  );
}
