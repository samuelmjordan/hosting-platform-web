import { Card } from "@/components/ui/card"
import { ServerIcon, Search } from "lucide-react"
import { Plan, Server } from "@/app/types"
import { ServerStatus } from "./hooks/useServerStatus"
import { ServerCard } from "./ServerCard"
import { CreateServerCard } from "./CreateServerCard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {STORE_PATH} from "@/app/constants";

interface ServerGridProps {
  plans: Plan[]
  servers: Server[]
  serverStatuses: Record<string, ServerStatus>
  searchQuery: string
  onCopyAddress: (text: string, id: string) => void
  copiedId: string | null
  onEditServer: (server: Server) => void
  onUpgradeServer: (server: Server) => void
}

export function ServerGrid({
     plans,
     servers,
     serverStatuses,
     searchQuery,
     onCopyAddress,
     copiedId,
     onEditServer,
     onUpgradeServer,
}: ServerGridProps) {
  const filteredServers = servers.filter((server) => {
    if (!searchQuery) return true
    return (
        server.server_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (server.cname_record_name && server.cname_record_name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  if (filteredServers.length === 0 && !searchQuery) {
    return (
        <Card className="bg-card">
          <div className="p-12 text-center">
            <ServerIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No servers found</h3>
            <p className="text-muted-foreground mb-6">Create your first server to get started</p>
            <Link href={STORE_PATH}>
              <Button className="bg-accent text-accent-foreground">
                <ServerIcon className="mr-2 h-4 w-4" />
                Create Server
              </Button>
            </Link>
          </div>
        </Card>
    )
  }

  if (filteredServers.length === 0 && searchQuery) {
    return (
        <Card className="bg-card">
          <div className="p-12 text-center">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No servers found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search query</p>
          </div>
        </Card>
    )
  }

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredServers.map((server) => {
          const serverId = server.cname_record_name || server.server_name
          const status = serverStatuses[server.subscription_id] || {
            machineOnline: false,
            minecraftOnline: false,
            isChecking: false,
            lastChecked: null,
            players: [],
          }

          return (
              <ServerCard
                  key={serverId}
                  plans={plans}
                  server={server}
                  status={status}
                  copiedId={copiedId}
                  onCopy={onCopyAddress}
                  onEdit={onEditServer}
                  onUpgrade={onUpgradeServer}
              />
          )
        })}

        {!searchQuery && <CreateServerCard />}
      </div>
  )
}