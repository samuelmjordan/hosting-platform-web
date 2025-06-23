import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Edit2,
  ServerIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"
import { Server } from "@/app/types"
import { ServerStatus } from "../hooks/useServerStatus"
import PlanTierBadge from "@/app/_components/common/PlanTierBadge";
import React from "react";
import {RegionBadge} from "@/app/_components/common/RegionBadge";

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
              <RegionBadge region="europe" />
              <PlanTierBadge specificationTitle={`${server.specification_title.toLowerCase()}`} />
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
      </div>
  )
}