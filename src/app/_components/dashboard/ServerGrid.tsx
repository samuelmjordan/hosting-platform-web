import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ServerIcon, Search } from "lucide-react"
import { Plan, Server } from "@/app/types"
import { ServerStatus } from "./hooks/useServerStatus"
import { ServerCard } from "./ServerCard"
import { CreateServerCard } from "./CreateServerCard"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ServerGridProps {
  plans: Plan[]
  servers: Server[]
  serverStatuses: Record<string, ServerStatus>
  searchQuery: string
  onCopyAddress: (text: string, id: string) => void
  copiedId: string | null
  onEditServer: (server: Server) => void
  onRefreshStatus: (server: Server) => void
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
  onRefreshStatus,
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
      <Card className="bg-white/80 backdrop-blur-sm">
        <div className="p-12 text-center">
          <ServerIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No servers found</h3>
          <p className="text-slate-500 mb-6">Create your first server to get started</p>
          <Link href="/store">
            <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
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
      <Card className="bg-white/80 backdrop-blur-sm">
        <div className="p-12 text-center">
          <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No servers found</h3>
          <p className="text-slate-500 mb-6">Try adjusting your search query</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
      {filteredServers.map((server) => {
        const serverId = server.cname_record_name || server.server_name
        const status = serverStatuses[server.cname_record_name || ""] || {
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
            onRefresh={onRefreshStatus}
            onUpgrade={onUpgradeServer}
          />
        )
      })}

      {!searchQuery && <CreateServerCard />}
    </div>
  )
}