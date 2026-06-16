import { MrHubDashboard } from "@/components/mockups/mr/MrHubDashboard";
import { getHubOverviewData } from "@/lib/mockups/mr/hub-overview";

export default async function MrHomePage() {
  const data = await getHubOverviewData();

  return <MrHubDashboard data={data} />;
}
