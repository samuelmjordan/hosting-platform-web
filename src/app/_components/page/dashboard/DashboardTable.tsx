"use client"

import { useState } from "react"
import { Server, Plan } from "@/app/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Search, ServerIcon } from "lucide-react"
import Link from "next/link"
import { StatsCards } from "./StatsCards"
import { ServerGrid } from "./ServerGrid"
import { EditServerDialog } from "./dialogs/EditServerDialog"
import { UpgradeServerDialog } from "./dialogs/UpgradeServerDialog"
import { useServerStatus } from "./hooks/useServerStatus"
import { useServerManagement } from "./hooks/useServerManagement"

interface DashboardTableProps {
  servers: Server[]
  plans: Plan[]
  userId: string
}

export function DashboardTable({ servers: initialServers, plans, userId }: DashboardTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const {
    serverStatuses,
    refreshStatus,
    checkAllServerStatuses
  } = useServerStatus(initialServers, userId)
  const {
    servers,
    editingServer,
    setEditingServer,
    upgradeServer,
    setUpgradeServer,
    handleEditServer,
    handleUpgradeServer,
  } = useServerManagement(initialServers, plans)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const activeServers = servers.filter((server) => server.subscription_status === "active")
  const totalPlayers = activeServers.reduce((sum, server) => {
    const status = serverStatuses[server.subscription_id]
    return sum + (status?.minecraftStatus.playerCount || 0)
  }, 0)

  return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Server Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search servers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
              />
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={checkAllServerStatuses}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/store">
              <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
              >
                <ServerIcon className="mr-2 h-4 w-4" />
                New server
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards
            servers={servers}
            serverStatuses={serverStatuses}
        />

        {/* Server Grid */}
        <ServerGrid
            plans={plans}
            servers={servers}
            serverStatuses={serverStatuses}
            searchQuery={searchQuery}
            onCopyAddress={handleCopy}
            copiedId={copiedId}
            onEditServer={setEditingServer}
            onRefreshStatus={refreshStatus}
            onUpgradeServer={setUpgradeServer}
        />

        {/* Dialogs */}
        <EditServerDialog
            server={editingServer}
            isOpen={editingServer !== null}
            onClose={() => setEditingServer(null)}
            onSave={handleEditServer}
        />

        <UpgradeServerDialog
            server={upgradeServer}
            plans={plans}
            isOpen={upgradeServer !== null}
            onClose={() => setUpgradeServer(null)}
            onSave={handleUpgradeServer}
        />
      </div>
  )
}

export default DashboardTable