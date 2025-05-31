"use client"

import { useState, useEffect, useCallback } from "react"
import type { CurrencyAmount, Server } from "@/app/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowUpRight,
  Copy,
  Cpu,
  Edit2,
  EllipsisVertical,
  Play,
  PowerOff,
  RefreshCw,
  Search,
  ServerIcon,
  Settings,
  Terminal,
  Trash2,
  Clock,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  Users,
  User,
  MemoryStick,
  DollarSign,
  Globe,
  Zap,
  Plus,
  MapPin,
  TrendingUp,
} from "lucide-react"
import Link from "next/dist/client/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

const formatDate = (timestamp: number) => {
  if (!timestamp) return "N/A"
  return new Date(timestamp * 1000000).toLocaleDateString()
}

const formatCurrency = (amount: CurrencyAmount): string => {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: amount.type,
  }).format(amount.value / 100)
}

const getRegionFlag = (regionCode: string) => {
  switch (regionCode) {
    case "WEST_EUROPE":
      return "🇪🇺"
    case "EAST_EUROPE":
      return "🇪🇺"
    default:
      return "🌐"
  }
}

const getPlanColor = (planName: string) => {
  switch (planName) {
    case "Wooden":
      return "from-amber-400 to-amber-600"
    case "Iron":
      return "from-slate-400 to-slate-600"
    case "Diamond":
      return "from-cyan-400 to-blue-600"
    default:
      return "from-gray-400 to-gray-600"
  }
}

const formatRegion = (regionCode: string) => {
  switch (regionCode) {
    case "WEST_EUROPE":
      return "EU West"
    case "EAST_EUROPE":
      return "EU East"
    default:
      return regionCode
  }
}

// Domain constants
const FIXED_DOMAIN = ".samuelmjordan.dev"
const MAX_SUBDOMAIN_LENGTH = 32
const MAX_TITLE_LENGTH = 32

// Player interface
interface Player {
  name: string
  id: string
}

// Server status types
interface ServerStatus {
  machineOnline: boolean
  minecraftOnline: boolean
  isChecking: boolean
  lastChecked: number | null
  playerCount?: number
  maxPlayers?: number
  version?: string
  motd?: string
  lastUpdated?: string
  duration?: string
  players?: Player[]
}

interface DashboardTableProps {
  servers: Server[]
}

export function DashboardTable({ servers }: DashboardTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingServer, setEditingServer] = useState<Server | null>(null)
  const [newServerName, setNewServerName] = useState("")
  const [newServerAddress, setNewServerAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerStatus>>({})

  const pingMachine = async (address: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/ping?address=${encodeURIComponent(address)}`)
      const data = await response.json()
      return data.status === "up"
    } catch (error) {
      return false
    }
  }

  const checkMinecraftServer = async (
    address: string,
  ): Promise<{
    online: boolean
    playerCount?: number
    maxPlayers?: number
    version?: string
    motd?: string
    lastUpdated?: string
    duration?: string
    players?: Player[]
  }> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      // Using mcstatus.io - way more reliable than mcapi.us
      const response = await fetch(`https://api.mcstatus.io/v2/status/java/${address}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'MinecraftStatusChecker/1.0'
        }
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        
        // Handle the different response structure
        const motdText = data.motd?.clean || data.motd?.raw || "A Minecraft Server"
        const versionName = data.version?.name_clean || data.version?.name_raw || "Unknown"
        
        return {
          online: data.online || false,
          playerCount: data.players?.online || 0,
          maxPlayers: data.players?.max || 0,
          version: versionName,
          motd: motdText,
          lastUpdated: new Date(data.retrieved_at).toISOString(),
          duration: `${Date.now() - data.retrieved_at}ms`, // rough estimate
          players: data.players?.list?.map((player: any) => ({
            name: player.name_clean || player.name_raw,
            id: player.uuid || ""
          })) || [],
        }
      }
    } catch (apiError) {
      console.warn("Minecraft status API failed:", apiError)
    }

    return {
      online: false,
      playerCount: 0,
      maxPlayers: 0,
      version: "Unknown",
      motd: "Connection Failed",
      players: [],
    }
  }

  const checkServerStatus = useCallback(async (server: Server) => {
    if (!server.cname_record_name) return

    const serverId = server.cname_record_name

    setServerStatuses((prev) => ({
      ...prev,
      [serverId]: {
        ...prev[serverId],
        isChecking: true,
      },
    }))

    try {
      const machineOnline = await pingMachine(server.cname_record_name)
      const minecraftStatus = await checkMinecraftServer(server.cname_record_name)

      setServerStatuses((prev) => ({
        ...prev,
        [serverId]: {
          machineOnline,
          minecraftOnline: minecraftStatus.online,
          isChecking: false,
          lastChecked: Date.now(),
          playerCount: minecraftStatus.playerCount,
          maxPlayers: minecraftStatus.maxPlayers,
          version: minecraftStatus.version,
          motd: minecraftStatus.motd,
          lastUpdated: minecraftStatus.lastUpdated,
          duration: minecraftStatus.duration,
          players: minecraftStatus.players,
        },
      }))
    } catch (error) {
      console.error("Error checking server status:", error)
      setServerStatuses((prev) => ({
        ...prev,
        [serverId]: {
          machineOnline: false,
          minecraftOnline: false,
          isChecking: false,
          lastChecked: Date.now(),
          players: [],
        },
      }))
    }
  }, [])

  const checkAllServerStatuses = useCallback(async () => {
    const serversWithAddresses = servers.filter((server) => server.cname_record_name)

    for (let i = 0; i < serversWithAddresses.length; i++) {
      setTimeout(() => {
        checkServerStatus(serversWithAddresses[i])
      }, i * 1000)
    }
  }, [servers, checkServerStatus])

  useEffect(() => {
    checkAllServerStatuses()
    const interval = setInterval(checkAllServerStatuses, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [checkAllServerStatuses])

  const handleRefreshStatus = (server: Server) => {
    if (server.cname_record_name) {
      checkServerStatus(server)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleEditClick = (server: Server) => {
    setEditingServer(server)
    setNewServerName(server.server_name)

    if (server.cname_record_name) {
      const subdomain = server.cname_record_name.replace(FIXED_DOMAIN, "")
      setNewServerAddress(subdomain)
    } else {
      setNewServerAddress("")
    }
  }

  const validateSubdomain = (subdomain: string): boolean => {
    if (subdomain.length === 0 || subdomain.length > MAX_SUBDOMAIN_LENGTH) {
      return false
    }

    const validPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/
    return validPattern.test(subdomain.toLowerCase())
  }

  const handleSaveServerDetails = async () => {
    if (!editingServer || !newServerName.trim()) return

    if (newServerName.trim().length > MAX_TITLE_LENGTH) {
      toast({
        title: "Error",
        description: `Server name must be ${MAX_TITLE_LENGTH} characters or less.`,
        variant: "destructive",
      })
      return
    }

    if (newServerAddress.trim() && !validateSubdomain(newServerAddress.trim())) {
      toast({
        title: "Error",
        description: `Subdomain must be 1-${MAX_SUBDOMAIN_LENGTH} characters, contain only letters, numbers, and hyphens, and cannot start or end with a hyphen.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      servers.forEach((server) => {
        if (
          server.cname_record_name === editingServer.cname_record_name ||
          (!server.cname_record_name && server.server_name === editingServer.server_name)
        ) {
          server.server_name = newServerName.trim()

          if (newServerAddress.trim()) {
            server.cname_record_name = newServerAddress.trim().toLowerCase() + FIXED_DOMAIN
          } else if (editingServer.cname_record_name && !newServerAddress.trim()) {
            server.cname_record_name = null
          }

          toast({
            title: "Server updated",
            description: `Server details have been updated successfully.`,
          })
        }
      })

      setEditingServer(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update server details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangeRegion = (server: Server) => {
    toast({
      title: "Change Region",
      description: `Opening region selection for ${server.server_name}...`,
    })
    // In a real app, this would open a region selection dialog or navigate to a page
  }

  const handleUpgradeServer = (server: Server) => {
    toast({
      title: "Upgrade Server",
      description: `Opening upgrade options for ${server.server_name}...`,
    })
    // In a real app, this would open an upgrade dialog or navigate to a page
  }

  const activeServers = servers.filter((server) => server.subscription_status === "active")
  const totalPlayers = activeServers.reduce((sum, server) => {
    const status = serverStatuses[server.cname_record_name || ""]
    return sum + (status?.playerCount || 0)
  }, 0)

  const filteredServers = servers.filter((server) => {
    if (!searchQuery) return true
    return (
      server.server_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (server.cname_record_name && server.cname_record_name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const isFormValid = () => {
    if (!editingServer || !newServerName.trim()) return false
    if (newServerName.trim().length > MAX_TITLE_LENGTH) return false
    if (newServerAddress.trim() && !validateSubdomain(newServerAddress.trim())) return false

    const nameChanged = newServerName.trim() !== editingServer.server_name
    const addressChanged =
      newServerAddress.trim().toLowerCase() !== (editingServer.cname_record_name?.replace(FIXED_DOMAIN, "") || "")

    return nameChanged || addressChanged
  }

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Online Servers</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {
                      servers.filter((server) => {
                        const status = serverStatuses[server.cname_record_name || ""]
                        return status?.minecraftOnline
                      }).length
                    }
                  </p>
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
                      value: servers.reduce((sum, server) => sum + server.minor_amount, 0),
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

        {/* Server Grid */}
        {filteredServers.length === 0 && !searchQuery ? (
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
        ) : filteredServers.length === 0 && searchQuery ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <div className="p-12 text-center">
              <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No servers found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your search query</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {/* Existing Server Cards */}
            {filteredServers.map((server) => {
              const serverId = server.cname_record_name || server.server_name
              const status = serverStatuses[server.cname_record_name || ""] || {
                machineOnline: false,
                minecraftOnline: false,
                isChecking: false,
                lastChecked: null,
                players: [],
              }

              const isOnline = status.machineOnline && status.minecraftOnline
              const isProvisioning = !server.cname_record_name

              return (
                <Card
                  key={serverId}
                  className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-slate-200 flex flex-col h-full`}
                >
                  {/* Server Header */}
                  <div className="p-6 pb-4 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanColor(
                            server.specification_title,
                          )} flex items-center justify-center shadow-lg`}
                        >
                          <ServerIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">{server.server_name}</h3>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleEditClick(server)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit server details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <span className="mr-1">{getRegionFlag(server.region_code)}</span>
                              {formatRegion(server.region_code)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPlanColor(server.specification_title).replace("from-", "bg-").replace("to-", "").split(" ")[0].replace("bg-", "bg-").replace("-400", "-100")} ${getPlanColor(server.specification_title).replace("from-", "text-").replace("to-", "").split(" ")[0].replace("text-", "text-").replace("-400", "-800")}`}
                            >
                              {server.specification_title}
                            </Badge>
                            {status.isChecking ? (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Checking
                              </Badge>
                            ) : (
                              <Badge
                                className={`text-xs ${
                                  isOnline
                                    ? "bg-green-100 text-green-800"
                                    : isProvisioning
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {isOnline ? (
                                  <>
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Online
                                  </>
                                ) : isProvisioning ? (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    Provisioning
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Offline
                                  </>
                                )}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditClick(server)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRefreshStatus(server)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Terminal className="mr-2 h-4 w-4" />
                            Console
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            {isOnline ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500">Stop</span>
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4 text-green-500" />
                                <span className="text-green-500">Start</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Server Address */}
                    {server.cname_record_name && (
                      <div className="flex items-center gap-2 mb-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 rounded-lg px-3 py-2 font-mono"
                                onClick={() => handleCopy(server.cname_record_name || "", serverId)}
                              >
                                <Globe className="h-4 w-4" />
                                {server.cname_record_name}
                                <Copy className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copiedId === serverId ? "Copied!" : "Copy server address"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    {/* Minecraft Server Info - Online */}
                    {server.cname_record_name && isOnline && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                              <div className="w-6 h-6 bg-green-600 rounded border-2 border-green-400 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-sm"></div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-800">{status.motd}</h4>
                              <p className="text-sm text-green-700">Version {status.version}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-green-800 font-medium text-sm">Online</span>
                            </div>
                            {status.lastUpdated && (
                              <div className="text-green-600 text-xs">
                                Updated {new Date(Number.parseInt(status.lastUpdated) * 1000).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-white/60 rounded-lg p-3 text-center">
                            <div className="text-green-800 font-semibold text-lg">
                              {status.playerCount}/{status.maxPlayers}
                            </div>
                            <div className="text-green-600 text-xs">Players Online</div>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3 text-center">
                            <div className="text-green-800 font-semibold text-lg">{status.version}</div>
                            <div className="text-green-600 text-xs">Version</div>
                          </div>
                        </div>

                        {/* Player Sample */}
                        {status.players && status.players.length > 0 && (
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-green-700" />
                              <span className="text-green-800 font-medium text-sm">Player Sample</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {status.players.slice(0, 3).map((player) => (
                                <TooltipProvider key={player.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                        <User className="h-3 w-3" />
                                        {player.name}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>UUID: {player.id}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                              {status.players.length > 3 && (
                                <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                                  +{status.players.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* No Players Online */}
                        {status.playerCount === 0 && (
                          <div className="bg-white/60 rounded-lg p-3 text-center">
                            <div className="flex items-center justify-center gap-2 text-green-700">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">No players currently online</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Minecraft Server Info - Offline */}
                    {server.cname_record_name && !isOnline && !status.isChecking && !isProvisioning && (
                      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                              <div className="w-6 h-6 bg-red-600 rounded border-2 border-red-400 flex items-center justify-center">
                                <XCircle className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-red-800">Server Offline</h4>
                              <p className="text-sm text-red-700">Unable to connect</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-red-800 font-medium text-sm">Offline</span>
                            </div>
                            {status.lastChecked && (
                              <div className="text-red-600 text-xs">
                                Checked {new Date(status.lastChecked).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/60 rounded-lg p-3 text-center">
                            <div className="text-red-800 font-semibold text-lg">0/0</div>
                            <div className="text-red-600 text-xs">Players Online</div>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3 text-center">
                            <div className="text-red-800 font-semibold text-lg">Unknown</div>
                            <div className="text-red-600 text-xs">Version</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Server Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Cpu className="h-4 w-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-900">{server.vcpu}</span>
                        </div>
                        <p className="text-xs text-slate-600">CPU Cores</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MemoryStick className="h-4 w-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-900">{server.ram_gb} GB</span>
                        </div>
                        <p className="text-xs text-slate-600">Memory</p>
                      </div>
                    </div>

                    {/* Billing */}
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-900">
                            {formatCurrency({ type: server.currency, value: server.minor_amount })}
                          </span>
                          <span className="text-xs text-slate-600">/month</span>
                        </div>
                        <Badge
                          className={`text-xs ${
                            server.subscription_status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {server.subscription_status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Auto-Renew</span>
                        <div className="flex items-center gap-1">
                          {!server.cancel_at_period_end ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              <span className="text-green-600">On</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 text-red-500" />
                              <span className="text-red-600">Off</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Period ends</span>
                        <div className="flex items-center gap-1">
                          {!server.cancel_at_period_end ? (
                            <>
                              <span className="">{formatDate(server.current_period_end)}</span> 
                            </>
                          ) : (
                            <>
                            <span className="text-red-600">{formatDate(server.current_period_end)}</span> 
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 mt-auto">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-xs"
                          onClick={() => handleChangeRegion(server)}
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Region
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-xs"
                          onClick={() => handleUpgradeServer(server)}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Upgrade
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-white">
                          <Terminal className="h-3 w-3 mr-1" />
                          Console
                        </Button>
                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}

            {/* Create New Server Card */}
            {!searchQuery && (
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 flex flex-col h-full">
                <div className="p-6 pb-4 flex-grow flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg mb-4">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Create New Server</h3>
                  <p className="text-slate-600 mb-6 max-w-sm">
                    Deploy a new Minecraft server in minutes. Choose from our optimized plans and get started instantly.
                  </p>
                </div>

                {/* Action Footer */}
                <div className="px-6 py-4 bg-pink-100/50 border-t border-pink-200 mt-auto">
                  <div className="flex justify-center">
                    <Link href="/store">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Server
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingServer !== null} onOpenChange={(open) => !open && setEditingServer(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Server Details</DialogTitle>
            <DialogDescription>Update your server name and address.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="server-name">
                Server Name{" "}
                <span className="text-xs text-slate-500">
                  ({newServerName.length}/{MAX_TITLE_LENGTH})
                </span>
              </Label>
              <Input
                id="server-name"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                placeholder="Enter server name"
                maxLength={MAX_TITLE_LENGTH}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-address">
                Server Address{" "}
                <span className="text-xs text-slate-500">
                  ({newServerAddress.length}/{MAX_SUBDOMAIN_LENGTH})
                </span>
              </Label>
              <div className="flex items-center">
                <Input
                  id="server-address"
                  value={newServerAddress}
                  onChange={(e) => setNewServerAddress(e.target.value.toLowerCase())}
                  placeholder="subdomain"
                  maxLength={MAX_SUBDOMAIN_LENGTH}
                  className="rounded-r-none"
                />
                <div className="bg-slate-50 border border-l-0 border-slate-200 px-3 py-2 text-sm text-slate-600 rounded-r-md">
                  {FIXED_DOMAIN}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Leave empty to remove address. Use only letters, numbers, and hyphens.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingServer(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveServerDetails}
              disabled={isSubmitting || !isFormValid()}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
