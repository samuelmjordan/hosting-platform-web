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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertCircle,
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
  Calendar,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  Wifi,
  WifiOff,
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
import {
  Tabs as DialogTabs,
  TabsContent,
  TabsList as DialogTabsList,
  TabsTrigger as DialogTabsTrigger,
} from "@/components/ui/tabs"

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

const formatRegion = (regionCode: string) => {
  switch (regionCode) {
    case "WEST_EUROPE":
      return "West Europe"
    case "EAST_EUROPE":
      return "East Europe"
    default:
      return regionCode
  }
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

const getPlanColour = (planName: string) => {
  switch (planName) {
    case "Wooden":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "Iron":
      return "bg-slate-100 text-slate-800 border-slate-200"
    case "Diamond":
      return "bg-sky-100 text-sky-800 border-sky-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getSubscriptionStatusColour = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "past_due":
      return "bg-yellow-100 text-yellow-800"
    case "unpaid":
    case "canceled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getFormattedSubscriptionStatus = (status: string) => {
  switch (status) {
    case "active":
      return "Active"
    case "past_due":
      return "Payment Past Due"
    case "unpaid":
      return "Unpaid"
    case "canceled":
      return "Canceled"
    default:
      return "null"
  }
}

// Domain constants
const FIXED_DOMAIN = ".samuelmjordan.dev"
const MAX_SUBDOMAIN_LENGTH = 32

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
}

interface DashboardTableProps {
  servers: Server[]
}

export function DashboardTable({ servers }: DashboardTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingServer, setEditingServer] = useState<Server | null>(null)
  const [newServerName, setNewServerName] = useState("")
  const [newServerAddress, setNewServerAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editDialogTab, setEditDialogTab] = useState("name")
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerStatus>>({})

  const pingMachine = async (address: string): Promise<boolean> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      await fetch(`${address}`, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return true
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
  }> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(`https://mcapi.us/server/status?ip=${address}`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return {
          online: data.online || false,
          playerCount: data.players?.online || 0,
          maxPlayers: data.players?.max || 0,
          version: data.version || "Unknown",
          motd: data.motd?.clean?.[0] || data.motd?.raw?.[0] || "A Minecraft Server",
        }
      }
    } catch (apiError) {
      console.warn("Minecraft status API failed, falling back to connectivity check:", apiError)
    }

    return {
      online: false,
      playerCount: 0,
      maxPlayers: 0,
      version: "Unknown",
      motd: "Connection Failed",
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

    // Set up periodic status checks every 10 seconds
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

  const handleEditClick = (server: Server, initialTab = "name") => {
    setEditingServer(server)
    setNewServerName(server.server_name)

    // Extract subdomain if address exists
    if (server.cname_record_name) {
      const subdomain = server.cname_record_name.replace(FIXED_DOMAIN, "")
      setNewServerAddress(subdomain)
    } else {
      setNewServerAddress("")
    }

    setEditDialogTab(initialTab)
  }

  const handleEditAddressClick = (server: Server) => {
    // Only allow editing if the address exists
    if (server.cname_record_name) {
      handleEditClick(server, "address")
    } else {
      toast({
        title: "Server not ready",
        description: "This server is still being provisioned. The address will be available soon.",
        variant: "default",
      })
    }
  }

  const handleSaveServerDetails = async () => {
    if (!editingServer) return

    if (editDialogTab === "name" && (!newServerName.trim() || newServerName.trim() === editingServer.server_name)) {
      return
    }

    if (
      editDialogTab === "address" &&
      (!newServerAddress.trim() ||
        (editingServer.cname_record_name && newServerAddress.trim() + FIXED_DOMAIN === editingServer.cname_record_name))
    ) {
      return
    }

    // Validate subdomain length
    if (editDialogTab === "address" && newServerAddress.trim().length > MAX_SUBDOMAIN_LENGTH) {
      toast({
        title: "Subdomain too long",
        description: `Subdomain must be ${MAX_SUBDOMAIN_LENGTH} characters or less.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would make an API call here
      // await updateServerDetails(editingServer.id, { name: newServerName, address: newServerAddress });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state
      servers.forEach((server) => {
        if (
          server.cname_record_name === editingServer.cname_record_name ||
          (!server.cname_record_name && server.server_name === editingServer.server_name)
        ) {
          if (editDialogTab === "name") {
            server.server_name = newServerName.trim()
            toast({
              title: "Server renamed",
              description: `Server has been renamed to "${newServerName.trim()}"`,
            })
          } else if (editDialogTab === "address") {
            const oldAddress = server.cname_record_name
            server.cname_record_name = newServerAddress.trim() + FIXED_DOMAIN
            toast({
              title: "Server address updated",
              description: `Server address has been changed from "${oldAddress}" to "${server.cname_record_name}"`,
            })

            // Recheck status for the updated server
            setTimeout(() => {
              checkServerStatus(server)
            }, 1000)
          }
        }
      })

      // Close dialog
      setEditingServer(null)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update server ${editDialogTab === "name" ? "name" : "address"}. Please try again.`,
        variant: "destructive",
      })
      console.error("Failed to update server details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeServers = servers.filter((server) => server.subscription_status === "active")
  const inactiveServers = servers.filter((server) => server.subscription_status !== "active")

  const filteredServers = servers
    .filter((server) => {
      if (activeTab === "active") return server.subscription_status === "active"
      if (activeTab === "inactive") return server.subscription_status !== "active"
      return true
    })
    .filter((server) => {
      if (!searchQuery) return true
      return (
        server.server_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (server.cname_record_name && server.cname_record_name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold">Your Servers</h1>
          <p className="text-gray-500">Manage and monitor your server instances</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search servers..."
              className="pl-9 h-10 w-full sm:w-[250px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={checkAllServerStatuses} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </Button>
          <Link href="/store">
            <Button className="bg-pink-600 hover:bg-pink-700">
              <ServerIcon className="mr-2 h-4 w-4" />
              New Server
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="rounded-md">
              All Servers <Badge className="ml-2 bg-gray-100 text-gray-800">{servers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-md">
              Active <Badge className="ml-2 bg-green-100 text-green-800">{activeServers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="rounded-md">
              Inactive <Badge className="ml-2 bg-red-100 text-red-800">{inactiveServers.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Empty State */}
      {filteredServers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <ServerIcon className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium">No servers found</h3>
          <p className="text-gray-500 mt-2 max-w-md">
            {searchQuery
              ? "Try adjusting your search query"
              : activeTab !== "all"
                ? `You don't have any ${activeTab} servers`
                : "Create your first server to get started"}
          </p>
          {!searchQuery && (
            <Link href="/store">
              <Button className="mt-6 bg-pink-600 hover:bg-pink-700">
                <ServerIcon className="mr-2 h-4 w-4" />
                Create Server
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredServers.map((server) => {
            const serverId = server.cname_record_name || server.server_name
            const status = serverStatuses[server.cname_record_name || ""] || {
              machineOnline: false,
              minecraftOnline: false,
              isChecking: false,
              lastChecked: null,
            }

            const planName = server.specification_title
            const subscriptionStatus = server.subscription_status
            const renew = !server.cancel_at_period_end

            return (
              <Card key={serverId} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  {/* Server Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 rounded-lg p-2 flex items-center justify-center">
                        <ServerIcon className="h-8 w-8 text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h2 className="text-xl font-semibold mr-2">{server.server_name}</h2>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleEditClick(server)}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  <span className="sr-only">Edit server name</span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit server name</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {/* Status Badges */}
                          <div className="flex items-center gap-2 ml-3">
                            {status.isChecking ? (
                              <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Checking...
                              </Badge>
                            ) : (
                              <>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        className={`flex items-center gap-1 ${
                                          status.machineOnline
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {status.machineOnline ? (
                                          <Wifi className="h-3 w-3" />
                                        ) : (
                                          <WifiOff className="h-3 w-3" />
                                        )}
                                        Machine
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Machine {status.machineOnline ? "is reachable" : "is unreachable"}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        className={`flex items-center gap-1 ${
                                          status.minecraftOnline
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {status.minecraftOnline ? (
                                          <CheckCircle2 className="h-3 w-3" />
                                        ) : (
                                          <XCircle className="h-3 w-3" />
                                        )}
                                        Minecraft
                                        {status.minecraftOnline && status.playerCount !== undefined && (
                                          <span className="ml-1">
                                            ({status.playerCount}/{status.maxPlayers})
                                          </span>
                                        )}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-sm">
                                        <p>Minecraft server is {status.minecraftOnline ? "online" : "offline"}</p>
                                        {status.minecraftOnline && (
                                          <>
                                            <p>
                                              Players: {status.playerCount}/{status.maxPlayers}
                                            </p>
                                            <p>Version: {status.version}</p>
                                            <p>MOTD: {status.motd}</p>
                                          </>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Server Address - Conditional Rendering */}
                        {server.cname_record_name ? (
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="flex items-center hover:text-gray-900 mr-1.5"
                                      onClick={() => handleCopy(server.cname_record_name || "", serverId)}
                                    >
                                      <span className="font-mono">{server.cname_record_name}</span>
                                      <Copy className="h-3.5 w-3.5 ml-1.5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {copiedId === serverId ? "Copied!" : "Copy server address"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleEditAddressClick(server)}
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                      <span className="sr-only">Edit server address</span>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit server address</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleRefreshStatus(server)}
                                      className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
                                      disabled={status.isChecking}
                                    >
                                      <RefreshCw className={`h-3.5 w-3.5 ${status.isChecking ? "animate-spin" : ""}`} />
                                      <span className="sr-only">Refresh status</span>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Refresh server status</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center mt-1 text-sm text-amber-600">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            <span>Server address is being provisioned...</span>
                          </div>
                        )}

                        {/* Last checked timestamp */}
                        {status.lastChecked && (
                          <div className="text-xs text-gray-400 mt-1">
                            Last checked: {new Date(status.lastChecked).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <EllipsisVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Server Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="flex items-center" onSelect={() => handleEditClick(server)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          <span>Rename Server</span>
                        </DropdownMenuItem>
                        {server.cname_record_name && (
                          <DropdownMenuItem
                            className="flex items-center"
                            onSelect={() => handleEditAddressClick(server)}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            <span>Edit Server Address</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="flex items-center"
                          onSelect={() => handleRefreshStatus(server)}
                          disabled={status.isChecking}
                        >
                          <RefreshCw className={`mr-2 h-4 w-4 ${status.isChecking ? "animate-spin" : ""}`} />
                          <span>Refresh Status</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          <span>Open Console</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <Terminal className="mr-2 h-4 w-4" />
                          <span>SSH Access</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center">
                          {status.minecraftOnline ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4 text-red-500" />
                              <span className="text-red-500">Stop Server</span>
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4 text-green-500" />
                              <span className="text-green-500">Start Server</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>Restart</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete Server</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Server Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1">
                      <span className="text-base leading-none">{getRegionFlag(server.region_code)}</span>
                      {formatRegion(server.region_code)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1.5 px-2 py-1 ${getPlanColour(planName)}`}
                    >
                      {planName}
                    </Badge>
                  </div>

                  {/* Server Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Server Specs */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 flex items-center mb-3">
                        <Cpu className="h-4 w-4 mr-2 text-gray-500" />
                        Specifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Memory</span>
                          <span className="font-medium text-sm">{server.ram_gb} GB</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">CPU</span>
                          <span className="font-medium text-sm">{server.vcpu} Cores</span>
                        </div>
                      </div>
                    </div>

                    {/* Billing Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 flex items-center mb-3">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                        Billing
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Monthly Cost</span>
                          <span className="font-medium text-sm">
                            {formatCurrency({ type: server.currency, value: server.minor_amount })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Next Payment</span>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span className="font-medium text-sm">{formatDate(server.current_period_end)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Status</span>
                          <Badge className={getSubscriptionStatusColour(subscriptionStatus)}>
                            {getFormattedSubscriptionStatus(subscriptionStatus)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Auto-Renew</span>
                          <div className="flex items-center">
                            {renew ? (
                              <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
                            )}
                            <span className="text-sm font-medium">{renew ? "On" : "Off"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end mt-6 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Terminal className="h-3.5 w-3.5 mr-1.5" />
                      Console
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Settings className="h-3.5 w-3.5 mr-1.5" />
                      Settings
                    </Button>
                    <Button size="sm" className="text-xs bg-pink-600 hover:bg-pink-700">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1.5" />
                      Manage
                    </Button>
                  </div>
                </div>

                {(!status.machineOnline || !status.minecraftOnline) && server.cname_record_name && (
                  <div className="bg-red-50 border-t border-red-100 px-6 py-3 flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-red-700">
                      {!status.machineOnline
                        ? "Machine is unreachable. Check your server configuration."
                        : "Minecraft server is offline. The machine is reachable but Minecraft isn't running."}
                    </span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Server Dialog */}
      <Dialog open={editingServer !== null} onOpenChange={(open) => !open && setEditingServer(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Server Details</DialogTitle>
            <DialogDescription>
              Update your server information. These changes only affect how the server appears in your dashboard.
            </DialogDescription>
          </DialogHeader>

          <DialogTabs value={editDialogTab} onValueChange={setEditDialogTab} className="w-full">
            <DialogTabsList className="grid w-full grid-cols-2">
              <DialogTabsTrigger value="name">Server Name</DialogTabsTrigger>
              <DialogTabsTrigger value="address" disabled={!editingServer?.cname_record_name}>
                Server Address
              </DialogTabsTrigger>
            </DialogTabsList>

            <TabsContent value="name" className="mt-4">
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="server-name" className="text-right">
                    Server Name
                  </Label>
                  <Input
                    id="server-name"
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    className="col-span-3"
                    autoFocus={editDialogTab === "name"}
                    placeholder="Enter server name"
                  />
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  This is the display name for your server in the dashboard.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="address" className="mt-4">
              {editingServer?.cname_record_name ? (
                <div className="grid gap-4 py-2">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="server-address" className="text-right">
                      Subdomain
                    </Label>
                    <div className="col-span-3 flex items-center">
                      <Input
                        id="server-address"
                        value={newServerAddress}
                        onChange={(e) => {
                          // Remove the domain part if user pastes full address
                          let value = e.target.value.replace(FIXED_DOMAIN, "")
                          // Remove any invalid characters
                          value = value.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase()
                          // Limit to max length
                          if (value.length <= MAX_SUBDOMAIN_LENGTH) {
                            setNewServerAddress(value)
                          }
                        }}
                        className="font-mono rounded-r-none"
                        autoFocus={editDialogTab === "address"}
                        placeholder="Enter subdomain"
                        maxLength={MAX_SUBDOMAIN_LENGTH}
                      />
                      <div className="bg-gray-100 text-gray-600 px-3 py-2 border border-l-0 border-gray-200 rounded-r-md font-mono text-sm">
                        {FIXED_DOMAIN}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <p>
                      Enter only the subdomain part (max {MAX_SUBDOMAIN_LENGTH} characters). The domain will always be{" "}
                      {FIXED_DOMAIN}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-amber-600">
                        <AlertCircle className="h-3.5 w-3.5 inline-block mr-1" />
                        Changing this may affect connectivity to your server.
                      </span>
                      <span
                        className={`text-xs ${
                          newServerAddress.length > MAX_SUBDOMAIN_LENGTH - 5
                            ? newServerAddress.length >= MAX_SUBDOMAIN_LENGTH
                              ? "text-red-500"
                              : "text-amber-500"
                            : "text-gray-400"
                        }`}
                      >
                        {newServerAddress.length}/{MAX_SUBDOMAIN_LENGTH}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Server address not available yet</h3>
                  <p className="text-gray-500 mt-2">
                    Your server is still being provisioned. The address will be available soon.
                  </p>
                </div>
              )}
            </TabsContent>
          </DialogTabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditingServer(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveServerDetails}
              disabled={
                isSubmitting ||
                (editDialogTab === "name" &&
                  (!newServerName.trim() || newServerName.trim() === editingServer?.server_name)) ||
                (editDialogTab === "address" &&
                  (!editingServer?.cname_record_name ||
                    !newServerAddress.trim() ||
                    newServerAddress.trim().length > MAX_SUBDOMAIN_LENGTH ||
                    newServerAddress.trim() + FIXED_DOMAIN === editingServer?.cname_record_name))
              }
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
