"use client"

import { useState } from "react"
import { Server, Region, Plan } from "@/app/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Search, ServerIcon } from "lucide-react"
import Link from "next/link"
import { StatsCards } from "./StatsCards"
import { ServerGrid } from "./ServerGrid"
import { EditServerDialog } from "./dialogs/EditServerDialog"
import { ChangeRegionDialog } from "./dialogs/ChangeRegionDialog"
import { UpgradeServerDialog } from "./dialogs/UpgradeServerDialog"
import { useServerStatus } from "./hooks/useServerStatus"
import { useServerManagement } from "./hooks/useServerManagement"

interface DashboardTableProps {
  servers: Server[]
  plans: Plan[]
  regions: Region[]
}

export function DashboardTable({ servers: initialServers, plans, regions }: DashboardTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // custom hooks
  const { serverStatuses, refreshStatus, checkAllServerStatuses } = useServerStatus(initialServers)
  const {
    servers,
    editingServer,
    setEditingServer,
    regionChangeServer,
    setRegionChangeServer,
    upgradeServer,
    setUpgradeServer,
    handleEditServer,
    handleChangeRegion,
    handleUpgradeServer,
  } = useServerManagement(initialServers, plans)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const activeServers = servers.filter((server) => server.subscription_status === "active")
  const totalPlayers = activeServers.reduce((sum, server) => {
    const status = serverStatuses[server.cname_record_name || ""]
    return sum + (status?.playerCount || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Server Dashboard</h1>
            <p className="text-slate-600 mt-1">
              {servers.length} servers • {activeServers.length} active • {totalPlayers} players online
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-white/80 backdrop-blur-sm border-slate-200"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkAllServerStatuses}
              className="bg-white/80 backdrop-blur-sm border-slate-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/store">
              <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg">
                <ServerIcon className="mr-2 h-4 w-4" />
                New Server
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards servers={servers} serverStatuses={serverStatuses} />

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
          onChangeRegion={setRegionChangeServer}
          onUpgradeServer={setUpgradeServer}
        />
      </div>

      {/* Dialogs */}
      <EditServerDialog
        server={editingServer}
        isOpen={editingServer !== null}
        onClose={() => setEditingServer(null)}
        onSave={handleEditServer}
      />

      <ChangeRegionDialog
        server={regionChangeServer}
        regions={regions}
        isOpen={regionChangeServer !== null}
        onClose={() => setRegionChangeServer(null)}
        onSave={handleChangeRegion}
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