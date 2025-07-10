import {useCallback, useEffect, useState} from "react"
import {ProvisioningStatus, Server} from "@/app/types"
import {STATUS_CHECK_INTERVAL} from "../utils/constants"
import {fetchSubscriptionProvisioningStatus} from "@/app/_services/protected/client/subscriptionClientService";

export interface Player {
  name: string
  id: string
}

export interface MinecraftStatus {
  minecraftOnline: boolean
  playerCount?: number
  maxPlayers?: number
  version?: string
  motd?: string
  lastUpdated?: string
  duration?: string
  players?: Player[]
}

export interface ServerStatus {
  provisioningStatus: ProvisioningStatus
  machineOnline: boolean
  minecraftStatus: MinecraftStatus
  isChecking: boolean
  lastChecked: number | null
}

const pingMachine = async (address: string | null): Promise<boolean> => {
  if (!address) {
    return false
  }

  try {
    const response = await fetch(`/api/ping?address=${encodeURIComponent(address)}`)
    const data = await response.json()
    return data.status === "up"
  } catch {
    return false
  }
}

const checkMinecraftServer = async (address: string | null): Promise<MinecraftStatus> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  if (!address) {
    return {
      minecraftOnline: false,
      playerCount: 0,
      maxPlayers: 0,
      version: "Unknown",
      motd: "Connection Failed",
      players: [],
    }
  }

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

      const motdText = data.motd?.clean || data.motd?.raw || "a minecraft server"
      const versionName = data.version?.name_clean || data.version?.name_raw || "Unknown"

      return {
        minecraftOnline: data.online || false,
        playerCount: data.players?.online || 0,
        maxPlayers: data.players?.max || 0,
        version: versionName,
        motd: motdText,
        lastUpdated: new Date(data.retrieved_at).toISOString(),
        duration: `${Date.now() - data.retrieved_at}ms`,
        players:
            data.players?.list?.map((player: { name_clean?: string; name_raw?: string; uuid?: string }) => ({
              name: player.name_clean || player.name_raw,
              id: player.uuid || "",
            })) || [],
      }
    }
  } catch (apiError) {
    console.warn("Minecraft status API failed:", apiError)
  }

  return {
    minecraftOnline: false,
    playerCount: 0,
    maxPlayers: 0,
    version: "Unknown",
    motd: "Connection Failed",
    players: [],
  }
}

const checkProvisioningStatus = async (subscriptionId: string | null): Promise<ProvisioningStatus> => {
  if (!subscriptionId) {
    return ProvisioningStatus.ERROR;
  }

  try {

    const provisioningStatus = await fetchSubscriptionProvisioningStatus(subscriptionId);
    return provisioningStatus;
  } catch (error) {
    console.error('failed to fetch provisioning status:', error);
    return ProvisioningStatus.ERROR;
  }
};

export const useServerStatus = (servers: Server[]) => {
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerStatus>>(() => {
    const initialStatuses: Record<string, ServerStatus> = {}
    servers.forEach(server => {
      initialStatuses[server.subscription_id] = {
        provisioningStatus: ProvisioningStatus.PENDING,
        machineOnline: false,
        minecraftStatus: {
          minecraftOnline: false,
          playerCount: 0,
          maxPlayers: 0,
          version: "Unknown",
          motd: "Connection Failed",
          players: [],
        },
        isChecking: true,
        lastChecked: null
      }
    })
    return initialStatuses
  })

  const checkServerStatus = useCallback(async (server: Server) => {
    try {
      const [machineOnline, minecraftStatus, provisioningStatus] = await Promise.all([
        pingMachine(server.cname_record_name),
        checkMinecraftServer(server.cname_record_name),
        checkProvisioningStatus(server.subscription_id)
      ])

      console.log(machineOnline)

      setServerStatuses((prev) => ({
        ...prev,
        [server.subscription_id]: {
          provisioningStatus,
          machineOnline,
          minecraftStatus,
          isChecking: false,
          lastChecked: Date.now()
        },
      }))
    } catch (error) {
      console.error("Error checking server status:", error)
      setServerStatuses((prev) => ({
        ...prev,
        [server.subscription_id]: {
          provisioningStatus: ProvisioningStatus.ERROR,
          machineOnline: false,
          minecraftStatus: {
            minecraftOnline: false,
            playerCount: 0,
            maxPlayers: 0,
            version: "Unknown",
            motd: "Connection Failed",
            players: [],
          },
          isChecking: true,
          lastChecked: null
        },
      }))
    }
  }, [])

  const checkAllServerStatuses = useCallback(async () => {
    await Promise.allSettled(
        servers.map(server => checkServerStatus(server))
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