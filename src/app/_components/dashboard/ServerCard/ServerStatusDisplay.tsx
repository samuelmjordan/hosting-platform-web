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

  if (!server.cname_record_name) return null

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

      {/* Online Status */}
      {isOnline && (
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

          {/* Player List */}
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

          {/* No Players */}
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

      {/* Offline Status */}
      {!isOnline && !status.isChecking && !isProvisioning && (
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
    </>
  )
}