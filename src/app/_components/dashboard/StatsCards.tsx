import { Card } from "@/components/ui/card"
import { CheckCircle2, Zap, Users, DollarSign } from "lucide-react"
import { Server } from "@/app/types"
import { ServerStatus } from "./hooks/useServerStatus"
import { formatCurrency } from "./utils/formatters"

interface StatsCardsProps {
  servers: Server[]
  serverStatuses: Record<string, ServerStatus>
}

export function StatsCards({ servers, serverStatuses }: StatsCardsProps) {
  const activeServers = servers.filter((server) => server.subscription_status === "active")
  
  const onlineServers = servers.filter((server) => {
    const status = serverStatuses[server.cname_record_name || ""]
    return status?.minecraftOnline
  })

  const totalPlayers = activeServers.reduce((sum, server) => {
    const status = serverStatuses[server.cname_record_name || ""]
    return sum + (status?.playerCount || 0)
  }, 0)

  const monthlyCost = servers.reduce((sum, server) => sum + server.minor_amount, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Online Servers</p>
              <p className="text-2xl font-bold text-purple-900">{onlineServers.length}</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Active Servers</p>
              <p className="text-2xl font-bold text-green-900">{activeServers.length}</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Players</p>
              <p className="text-2xl font-bold text-blue-900">{totalPlayers}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Monthly Cost</p>
              <p className="text-2xl font-bold text-amber-900">
                {formatCurrency({
                  type: servers[0]?.currency || "USD",
                  value: monthlyCost,
                })}
              </p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}