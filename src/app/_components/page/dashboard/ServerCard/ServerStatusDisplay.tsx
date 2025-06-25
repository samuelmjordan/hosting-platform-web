import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Globe, Copy, Users, User, XCircle, Loader2 } from "lucide-react"
import { Server } from "@/app/types"
import { ServerStatus } from "../hooks/useServerStatus"

interface ServerStatusDisplayProps {
    server: Server
    status: ServerStatus
    isOnline: boolean
    statusReady: boolean
    copiedId: string | null
    onCopy: (text: string, id: string) => void
}

export function ServerStatusDisplay({
    server,
    status,
    isOnline,
    statusReady,
    copiedId,
    onCopy,
}: ServerStatusDisplayProps) {
    const serverId = server.cname_record_name || server.server_name
    const isProvisioned = server.cname_record_name != null

    const formatTime = (timestamp: string | number) =>
        new Date(typeof timestamp === 'string' ? parseInt(timestamp) * 1000 : timestamp).toLocaleTimeString()

    const StatusHeader = () => {
        const getStatusText = () => {
            if (!statusReady) return 'Checking...'
            return isOnline ? status.minecraftStatus.motd : 'Server Offline'
        }

        const getSubtext = () => {
            if (!statusReady) return 'Fetching server info'
            return isOnline ? `version ${status.minecraftStatus.version}` : 'Unable to connect'
        }

        const getTextColor = () => {
            if (!statusReady) return 'text-amber-700 dark:text-amber-300'
            return isOnline ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
        }

        const getSubtextColor = () => {
            if (!statusReady) return 'text-amber-600 dark:text-amber-400'
            return isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }

        return (
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div>
                        <h4 className={`font-semibold ${getTextColor()}`}>
                            {getStatusText()}
                        </h4>
                        <p className={`text-sm ${getSubtextColor()}`}>
                            {getSubtext()}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                            !statusReady ? 'bg-amber-500 animate-pulse' :
                                isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`} />
                        <span className={`font-medium text-sm ${
                            !statusReady ? 'text-amber-700 dark:text-amber-300' :
                                isOnline ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                        }`}>
              {!statusReady ? 'Checking' : isOnline ? 'Online' : 'Offline'}
            </span>
                    </div>
                    {(isOnline ? status.minecraftStatus.lastUpdated : status.lastChecked) && statusReady && (
                        <div className={`text-xs ${
                            !statusReady ? 'text-amber-600 dark:text-amber-400' :
                                isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                            {isOnline ? 'Updated' : 'Checked'} {formatTime(isOnline ? status.minecraftStatus.lastUpdated! : status.lastChecked!)}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const StatsGrid = () => {
        const getStatsTextColor = () => {
            if (!statusReady) return 'text-amber-700 dark:text-amber-300'
            return isOnline ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
        }

        const getStatsSubtextColor = () => {
            if (!statusReady) return 'text-amber-600 dark:text-amber-400'
            return isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }

        return (
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-background/60 rounded-lg p-3 text-center">
                    <div className={`font-semibold text-lg ${getStatsTextColor()}`}>
                        {!statusReady ? '...' : isOnline ? `${status.minecraftStatus.playerCount}/${status.minecraftStatus.maxPlayers}` : '0/0'}
                    </div>
                    <div className={`text-xs ${getStatsSubtextColor()}`}>Players online</div>
                </div>
                <div className="bg-background/60 rounded-lg p-3 text-center">
                    <div className={`font-semibold text-lg ${getStatsTextColor()}`}>
                        {!statusReady ? '...' : isOnline ? status.minecraftStatus.version : 'Unknown'}
                    </div>
                    <div className={`text-xs ${getStatsSubtextColor()}`}>Version</div>
                </div>
            </div>
        )
    }

    const PlayerList = () => {
        if (!statusReady) {
            return (
                <div className="bg-background/60 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Loading player list...</span>
                    </div>
                </div>
            )
        }

        const hasPlayers = isOnline && (status.minecraftStatus.players?.length ?? 0) > 0
        const getPlayerTextColor = () => {
            return isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }

        const getPlayerBgColor = () => {
            return isOnline ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'
        }

        return (
            <div className="bg-background/60 rounded-lg p-3">
                {hasPlayers ? (
                    <>
                        <div className="flex items-center gap-2 mb-2">
                            <Users className={`h-4 w-4 ${getPlayerTextColor()}`} />
                            <span className={`font-medium text-sm ${isOnline ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>Player Sample</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {status.minecraftStatus.players!.slice(0, 3).map((player) => (
                                <TooltipProvider key={player.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className={`flex items-center gap-1 ${getPlayerBgColor()} px-2 py-1 rounded text-xs`}>
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
                            {status.minecraftStatus.players!.length > 3 && (
                                <div className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                                    +{status.minecraftStatus.players!.length - 3} more
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={`flex items-center justify-center gap-2 ${getPlayerTextColor()}`}>
                        <Users className="h-4 w-4" />
                        <span className="text-sm">No players currently online</span>
                    </div>
                )}
            </div>
        )
    }

    const getStatusBgColor = () => {
        if (!statusReady) return 'bg-gradient-to-r from-amber-50/80 to-amber-100/80 border-amber-200/80 dark:from-amber-950/20 dark:to-amber-900/20 dark:border-amber-800/20'
        return isOnline
            ? 'bg-gradient-to-r from-green-50/80 to-green-100/80 border-green-200/80 dark:from-green-950/20 dark:to-green-900/20 dark:border-green-800/20'
            : 'bg-gradient-to-r from-red-50/80 to-red-100/80 border-red-200/80 dark:from-red-950/20 dark:to-red-900/20 dark:border-red-800/20'
    }

    return (
        <>
            {/* Server Address */}
            <div className="flex items-center gap-2 mb-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted/50 rounded-lg px-3 py-2 font-mono"
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
            <div className={`${getStatusBgColor()} border rounded-lg p-4 mb-4`}>
                <StatusHeader />
                <StatsGrid />
                <PlayerList />
            </div>
        </>
    )
}