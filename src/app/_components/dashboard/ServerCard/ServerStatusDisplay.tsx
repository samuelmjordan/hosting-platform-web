import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Globe, Copy, Users, User, XCircle } from "lucide-react"
import { Server } from "@/app/types"
import { ServerStatus } from "../hooks/useServerStatus"

interface ServerStatusDisplayProps {
  server: Server
  status: ServerStatus
  isOnline: boolean
  isProvisioning: boolean
  copiedId: string | null
  onCopy: (text: string, id: string) => void
}

export function ServerStatusDisplay({
  server,
  status,
  isOnline,
  isProvisioning,
  copiedId,
  onCopy,
}: ServerStatusDisplayProps) {
  const serverId = server.cname_record_name || server.server_name
  const isProvisioned = server.cname_record_name != null

  const formatTime = (timestamp: string | number) => 
    new Date(typeof timestamp === 'string' ? parseInt(timestamp) * 1000 : timestamp).toLocaleTimeString()

  const StatusIcon = ({ online }: { online: boolean }) => (
    <div className={`w-10 h-10 ${online ? 'bg-green-500' : 'bg-red-500'} rounded-lg flex items-center justify-center`}>
      <div className={`w-6 h-6 ${online ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'} rounded border-2 flex items-center justify-center`}>
        {online ? (
          <div className="w-3 h-3 bg-white rounded-sm" />
        ) : (
          <XCircle className="w-3 h-3 text-white" />
        )}
      </div>
    </div>
  )

  const StatusHeader = ({ online }: { online: boolean }) => {
    const colors = online ? 'green' : 'red'
    return (
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <StatusIcon online={online} />
          <div>
            <h4 className={`font-semibold text-${colors}-800`}>
              {online ? status.motd : 'Server Offline'}
            </h4>
            <p className={`text-sm text-${colors}-700`}>
              {online ? `Version ${status.version}` : 'Unable to connect'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 bg-${colors}-500 rounded-full ${online ? 'animate-pulse' : ''}`} />
            <span className={`text-${colors}-800 font-medium text-sm`}>
              {online ? 'Online' : 'Offline'}
            </span>
          </div>
          {(online ? status.lastUpdated : status.lastChecked) && (
            <div className={`text-${colors}-600 text-xs`}>
              {online ? 'Updated' : 'Checked'} {formatTime(online ? status.lastUpdated! : status.lastChecked!)}
            </div>
          )}
        </div>
      </div>
    )
  }

  const StatsGrid = ({ online }: { online: boolean }) => {
    const colors = online ? 'green' : 'red'
    return (
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/60 rounded-lg p-3 text-center">
          <div className={`text-${colors}-800 font-semibold text-lg`}>
            {online ? `${status.playerCount}/${status.maxPlayers}` : '0/0'}
          </div>
          <div className={`text-${colors}-600 text-xs`}>Players Online</div>
        </div>
        <div className="bg-white/60 rounded-lg p-3 text-center">
          <div className={`text-${colors}-800 font-semibold text-lg`}>
            {online ? status.version : 'Unknown'}
          </div>
          <div className={`text-${colors}-600 text-xs`}>Version</div>
        </div>
      </div>
    )
  }

  const PlayerList = ({ online }: { online: boolean }) => {
    const hasPlayers = online && (status.players?.length ?? 0) > 0
    const colors = online ? 'green' : 'red'
    
    return (
      <div className="bg-white/60 rounded-lg p-3">
        {hasPlayers ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Users className={`h-4 w-4 text-${colors}-700`} />
              <span className={`text-${colors}-800 font-medium text-sm`}>Player Sample</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {status.players!.slice(0, 3).map((player) => (
                <TooltipProvider key={player.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`flex items-center gap-1 bg-${colors}-100 text-${colors}-800 px-2 py-1 rounded text-xs`}>
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
              {status.players!.length > 3 && (
                <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                  +{status.players!.length - 3} more
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={`flex items-center justify-center gap-2 text-${colors}-700`}>
            <Users className="h-4 w-4" />
            <span className="text-sm">No players currently online</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Server Address */}
      <div className="flex items-center gap-2 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 rounded-lg px-3 py-2 font-mono"
                onClick={() => onCopy(server.cname_record_name || "", serverId)}
                disabled={!isProvisioned}
              >
                <Globe className="h-4 w-4" />
                {server.cname_record_name || "..."}
                {isProvisioned && <Copy className="h-3 w-3" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {copiedId === serverId 
                  ? "Copied!" 
                  : !isProvisioned 
                    ? "Server is not yet provisioned" 
                    : "Copy server address"
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Status Card */}
      <div className={`bg-gradient-to-r ${isOnline ? 'from-green-50 to-emerald-50 border-green-200' : 'from-red-50 to-rose-50 border-red-200'} border rounded-lg p-4 mb-4`}>
        <StatusHeader online={isOnline} />
        <StatsGrid online={isOnline} />
        <PlayerList online={isOnline} />
      </div>
    </>
  )
}