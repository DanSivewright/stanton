import { HubDashboard } from "@/components/app/HubDashboard";
import { getHubOverviewData } from "@/lib/app/hub-overview";

export default async function HomePage() {
  const data = await getHubOverviewData();

  return <HubDashboard data={data} />;
}
