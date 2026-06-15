import { notFound } from "next/navigation";
import { LocationOverviewDashboard } from "@/components/mockups/mr/LocationOverviewDashboard";
import { relId } from "@/lib/mockups/helpers";
import { getLocationOverviewData } from "@/lib/mockups/mr/location-overview";
import { findById } from "@/lib/mockups/queries";
import type { Location } from "@/payload-types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LocationOverviewPage({ params }: PageProps) {
  const { id } = await params;
  const location = await findById<Location>("locations", id);

  if (!location) {
    notFound();
  }

  const companyId = relId(location.company);
  if (!companyId) {
    notFound();
  }

  const overviewData = await getLocationOverviewData(location.id);

  return (
    <LocationOverviewDashboard data={overviewData} locationId={location.id} />
  );
}
