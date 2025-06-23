import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Edit2,
  EllipsisVertical,
  Play,
  PowerOff,
  RefreshCw,
  ServerIcon,
  Settings,
  Terminal,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"
import { Server } from "@/app/types"
import { ServerStatus } from "../hooks/useServerStatus"
import { getPlanColor, getRegionFlag, formatRegion } from "../utils/formatters"

interface ServerHeaderProps {
  server: Server
  status: ServerStatus
  isOnline: boolean
  isProvisioning: boolean
  onEdit: () => void
  onRefresh: () => void
}

export function ServerHeader({
                               server,
                               status,
                               isOnline,
                               isProvisioning,
                               onEdit,
                               onRefresh,
                             }: ServerHeaderProps) {
  return (
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
            <ServerIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{server.server_name}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                        onClick={onEdit}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>edit server details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                <span className="mr-1">{getRegionFlag(server.region_code)}</span>
                {formatRegion(server.region_code)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {server.specification_title.toLowerCase()}
              </Badge>
              {status.isChecking ? (
                  <Badge variant="outline" className="text-xs text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin text-amber-600 dark:text-amber-400" />
                    checking
                  </Badge>
              ) : (
                  <Badge
                      variant={
                        isOnline
                            ? "default"
                            : isProvisioning
                                ? "secondary"
                                : "destructive"
                      }
                      className={`text-xs ${
                          isOnline
                              ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
                              : isProvisioning
                                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                                  : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700"
                      }`}
                  >
                    {isOnline ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                          online
                        </>
                    ) : isProvisioning ? (
                        <>
                          <Clock className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                          provisioning
                        </>
                    ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1 text-red-600 dark:text-red-400" />
                          offline
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
            <DropdownMenuItem onClick={onEdit}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRefresh}>
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
  )
}