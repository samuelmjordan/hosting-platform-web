import { useState, useCallback, useEffect } from "react"
import { Server } from "@/app/types"
import { STATUS_CHECK_INTERVAL } from "../utils/constants"

export interface Player {
  name: string
  id: string
}

export interface ServerStatus {
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
    address: string
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
    const response = await fetch(`https://api.mcstatus.io/v2/status/java/${address}`, {
      signal: controller.signal,
      headers: {
        "User-Agent": "MinecraftStatusChecker/1.0",
      },
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()

      const motdText = data.motd?.clean || data.motd?.raw || "A Minecraft Server"
      const versionName = data.version?.name_clean || data.version?.name_raw || "Unknown"

      return {
        online: data.online || false,
        playerCount: data.players?.online || 0,
        maxPlayers: data.players?.max || 0,
        version: versionName,
        motd: motdText,
        lastUpdated: new Date(data.retrieved_at).toISOString(),
        duration: `${Date.now() - data.retrieved_at}ms`,
        players:
            data.players?.list?.map((player: any) => ({
              name: player.name_clean || player.name_raw,
              id: player.uuid || "",
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

export const useServerStatus = (servers: Server[]) => {
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerStatus>>(() => {
    const initialStatuses: Record<string, ServerStatus> = {}
    servers.forEach(server => {
      if (server.cname_record_name) {
        initialStatuses[server.cname_record_name] = {
          machineOnline: false,
          minecraftOnline: false,
          isChecking: true,
          lastChecked: null,
          players: [],
        }
      }
    })
    return initialStatuses
  })

  const checkServerStatus = useCallback(async (server: Server) => {
    if (!server.cname_record_name) return

    const serverId = server.cname_record_name

    try {
      const [machineOnline, minecraftStatus] = await Promise.all([
        pingMachine(server.cname_record_name),
        checkMinecraftServer(server.cname_record_name)
      ])

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

    // fire all checks in parallel instead of sequential with delays
    await Promise.allSettled(
        serversWithAddresses.map(server => checkServerStatus(server))
    )
  }, [servers, checkServerStatus])

  useEffect(() => {
    checkAllServerStatuses()
    const interval = setInterval(checkAllServerStatuses, STATUS_CHECK_INTERVAL)
    return () => clearInterval(interval)
  }, [checkAllServerStatuses])

  const refreshStatus = (server: Server) => {
    if (server.cname_record_name) {
      checkServerStatus(server)
    }
  }

  return {
    serverStatuses,
    refreshStatus,
    checkAllServerStatuses,
  }
}