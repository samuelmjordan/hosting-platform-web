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
    const status = serverStatuses[server.subscription_id]
    return status?.minecraftStatus.minecraftOnline
  })

  const totalPlayers = activeServers.reduce((sum, server) => {
    const status = serverStatuses[server.subscription_id]
    return sum + (status?.minecraftStatus.playerCount || 0)
  }, 0)

  const monthlyCost = servers.reduce((sum, server) => sum + server.minor_amount, 0)

  return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online servers</p>
                <p className="text-2xl font-bold text-foreground">{onlineServers.length}</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active subscriptions</p>
                <p className="text-2xl font-bold text-foreground">{activeServers.length}</p>
              </div>
              <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total players</p>
                <p className="text-2xl font-bold text-foreground">{totalPlayers}</p>
              </div>
              <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly cost</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency({
                    type: servers[0]?.currency || "USD",
                    value: monthlyCost,
                  })}
                </p>
              </div>
              <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}