import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MaintenanceTeamsListView } from "@/components/mockups/mr/MaintenanceTeamsListView";
import { relId } from "@/lib/mockups/helpers";
import { buildLocationListWhere } from "@/lib/mockups/mr/location-filters";
import { findById } from "@/lib/mockups/queries";
import type { Location } from "@/payload-types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function LocationMaintenanceTeamsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const location = await findById<Location>("locations", id);

  if (!location) {
    notFound();
  }

  const companyId = relId(location.company);
  if (!companyId) {
    notFound();
  }

  const listParams = await searchParams;
  const where = buildLocationListWhere(
    "maintenance-teams",
    location.id,
    companyId,
    listParams.q?.trim() ?? ""
  );

  return (
    <Suspense
      fallback={
        <div className="h-48 animate-pulse rounded-xl bg-bg-weak-50" />
      }
    >
      <MaintenanceTeamsListView
        placeholder="Search maintenance teams..."
        searchParams={listParams}
        where={where}
      />
    </Suspense>
  );
}
