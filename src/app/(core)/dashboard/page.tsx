import { Server } from "@/app/types"
import { DashboardTable } from "@/app/_components/dashboard/dahboardTable"
import { Card } from "@/components/ui/card"
import { fetchServers } from "@/app/_services/serverService";

const servers: Server[] = await fetchServers();

export default async function Dashboard() {
  return (
    <div className="container mx-auto py-6">
      <Card className="mt-6">
        <DashboardTable servers={servers}/>
      </Card>
    </div>
  )
}