import { notFound } from "next/navigation";
import { LocationOverviewDashboard } from "@/components/app/LocationOverviewDashboard";
import { relId } from "@/lib/app/helpers";
import { getLocationOverviewData } from "@/lib/app/location-overview";
import { findById } from "@/lib/app/queries";
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
