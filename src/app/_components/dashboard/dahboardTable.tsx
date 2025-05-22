"use client"

import { SetStateAction, useState } from "react"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertCircle,
  ArrowUpRight,
  Copy,
  Cpu,
  Edit2,
  EllipsisVertical,
  HardDrive,
  Play,
  PowerOff,
  RefreshCw,
  Search,
  ServerIcon,
  Settings,
  Terminal,
  Trash2,
  Users,
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

interface DashboardTableProps {
  servers: Server[]
}

export function DashboardTable({ servers }: DashboardTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingServer, setEditingServer] = useState<Server | null>(null)
  const [newServerName, setNewServerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleEditClick = (server: Server) => {
    setEditingServer(server)
    setNewServerName(server.server_name)
  }

  const handleSaveServerName = async () => {
    if (!editingServer || !newServerName.trim()) return

    setIsSubmitting(true)

    try {
      // In a real app, you would make an API call here
      // await updateServerName(editingServer.cname_record_name, newServerName);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state
      servers.forEach((server) => {
        if (server.cname_record_name === editingServer.cname_record_name) {
          server.server_name = newServerName.trim()
        }
      })

      toast({
        title: "Server renamed",
        description: `Server has been renamed to "${newServerName.trim()}"`,
      })

      // Close dialog
      setEditingServer(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename server. Please try again.",
        variant: "destructive",
      })
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
          <Link href="/store">
            <Button>
              <ServerIcon className="mr-2 h-4 w-4" />
              New Server
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All Servers <Badge className="ml-2 bg-gray-100 text-gray-800">{servers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active">
              Active <Badge className="ml-2 bg-green-100 text-green-800">{activeServers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive <Badge className="ml-2 bg-red-100 text-red-800">{inactiveServers.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredServers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ServerIcon className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">No servers found</h3>
          <p className="text-gray-500 mt-2">
            {searchQuery
              ? "Try adjusting your search query"
              : activeTab !== "all"
                ? `You don't have any ${activeTab} servers`
                : "Create your first server to get started"}
          </p>
          {!searchQuery && (
            <Link href="/store">
              <Button className="mt-4">
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
            const serverStatus = true
            const planName = server.specification_title
            const subscriptionStatus = server.subscription_status
            const playerCount = 5 // Placeholder - in a real app, you'd get this from the server data
            const maxPlayers = 20 // Placeholder - in a real app, you'd get this from the server data

            return (
              <Card key={serverId} className="overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Server Info */}
                    <div className="md:col-span-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-semibold flex items-center">
                            <span className="mr-2">{server.server_name}</span>
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
                            <Badge
                              className={`ml-3 ${serverStatus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {serverStatus ? "Online" : "Offline"}
                            </Badge>
                          </h2>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="flex items-center hover:text-gray-900"
                                    onClick={() => handleCopy(server.cname_record_name || "", serverId)}
                                  >
                                    <span className="font-mono truncate max-w-[300px]">{server.cname_record_name}</span>
                                    <Copy className="h-3.5 w-3.5 ml-1.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {copiedId === serverId ? "Copied!" : "Copy server address"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
                              {serverStatus ? (
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

                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center text-sm">
                          <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1">
                            <span className="text-base leading-none">{getRegionFlag(server.region_code)}</span>
                            {formatRegion(server.region_code)}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm">
                          <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1">
                            <Users className="h-3.5 w-3.5" />
                            {playerCount}/{maxPlayers}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm">
                          <Badge
                            variant="outline"
                            className={`flex items-center gap-1.5 px-2 py-1 ${getPlanColour(planName)}`}
                          >
                            {planName}
                          </Badge>
                        </div>
                      </div>

                      {serverStatus && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">CPU Usage</span>
                            <span className="font-medium">24%</span>
                          </div>
                          <Progress value={24} className="h-2" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Memory Usage</span>
                            <span className="font-medium">3.2 GB / {server.ram_gb}</span>
                          </div>
                          <Progress value={40} className="h-2" />
                        </div>
                      )}
                    </div>

                    {/* Divider for mobile */}
                    <div className="md:hidden border-t border-gray-100 w-full my-2"></div>

                    {/* Server Specs & Billing */}
                    <div className="md:col-span-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h3 className="font-medium text-gray-500">Specifications</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <HardDrive className="h-4 w-4 text-gray-500" />
                            <span>{server.ram_gb} RAM</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Cpu className="h-4 w-4 text-gray-500" />
                            <span>{server.vcpu} CPU</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider for mobile */}
                    <div className="md:hidden border-t border-gray-100 w-full my-2"></div>

                    {/* Billing Info */}
                    <div className="md:col-span-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h3 className="font-medium text-gray-500">Billing</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Monthly Cost</span>
                            <span className="font-medium">
                              {formatCurrency({ type: server.currency, value: server.minor_amount })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Next Payment</span>
                            <span className="font-medium">{formatDate(server.current_period_end)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Subscription Status</span>
                            <Badge className={`ml-3 ${getSubscriptionStatusColour(subscriptionStatus)}`}>
                              {getFormattedSubscriptionStatus(subscriptionStatus)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Auto-Renew</span>
                            <Badge
                              className={
                                server.cancel_at_period_end ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }
                            >
                              {server.cancel_at_period_end ? "Off" : "On"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" className="text-xs">
                          Manage Billing
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {!serverStatus && (
                  <div className="bg-red-50 border-t border-red-100 px-6 py-3 flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-red-700">
                      This server is currently offline. Restart it to make it available.
                    </span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Server Name Dialog */}
      <Dialog open={editingServer !== null} onOpenChange={(open) => !open && setEditingServer(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Server</DialogTitle>
            <DialogDescription>
              Enter a new name for your server. This will only change the display name for the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="server-name" className="text-right">
                Server Name
              </Label>
              <Input
                id="server-name"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                className="col-span-3"
                autoFocus
                placeholder="Enter server name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingServer(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveServerName}
              disabled={!newServerName.trim() || isSubmitting || newServerName.trim() === editingServer?.server_name}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
