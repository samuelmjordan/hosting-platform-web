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
import {ProvisioningStatusBadge} from "@/app/_components/page/dashboard/ServerCard/ProvisioningStatusBadge";

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
                    <p>Edit server details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <RegionBadge region="Europe" />
              <PlanTierBadge specificationTitle={`${server.specification_title}`} />
              <ProvisioningStatusBadge status={status.provisioningStatus} />
            </div>
          </div>
        </div>
      </div>
  )
}