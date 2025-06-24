import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ProvisioningStatus, McHostDashboardClient, ProvisioningStatusResponse } from '@/app/_services/serverDetailsService'

export interface Player {
  name: string
  id: string
}

export interface MinecraftStatus {
  online: boolean
  playerCount?: number
  maxPlayers?: number
  version?: string
  motd?: string
  lastUpdated?: string
  duration?: string
  players?: Player[]
}

export interface ServerStatuses {
  provisioningStatus: ProvisioningStatus
  machineOnline: boolean
  minecraftStatus: MinecraftStatus
  isChecking: boolean
  lastChecked: number | null
}

export interface ServerInput {
  address: string
  subscriptionId: string
}

interface UseServerStatusReturn {
  serverStatuses: Record<string, ServerStatuses>
  refreshStatus: (server: ServerInput) => Promise<void>
  refreshAllStatuses: (servers: ServerInput[]) => Promise<void>
  isAnyChecking: boolean
}

const checkMinecraftStatus = async (address: string): Promise<MinecraftStatus> => {
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

      const motdText = data.motd?.clean || data.motd?.raw || "a minecraft server"
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
    console.warn("minecraft status api failed:", apiError)
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

export function useServerStatus(
    userId: string,
    initialServers: ServerInput[] = [],
    refreshInterval: number = 30000
): UseServerStatusReturn {
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerStatuses>>({})
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  // initialize api client
  const apiClient = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_API_URL not configured')
    }
    return new McHostDashboardClient(baseUrl, userId)
  }, [userId])

  // initialize statuses for all servers
  useEffect(() => {
    const initStatuses: Record<string, ServerStatuses> = {}

    initialServers.forEach(server => {
      initStatuses[server.address] = {
        provisioningStatus: ProvisioningStatus.READY,
        machineOnline: false,
        minecraftStatus: {
          online: false,
          lastUpdated: ''
        },
        isChecking: false,
        lastChecked: null
      }
    })

    setServerStatuses(initStatuses)
  }, [initialServers])

  // batch status check for multiple servers
  const checkBatchStatuses = useCallback(async (servers: ServerInput[]) => {
    if (servers.length === 0) return

    // set all to checking
    setServerStatuses(prev => {
      const updated = { ...prev }
      servers.forEach(server => {
        if (updated[server.address]) {
          updated[server.address] = {
            ...updated[server.address],
            isChecking: true
          }
        }
      })
      return updated
    })

    try {
      // batch provisioning status
      const subscriptionIds = servers.map(s => s.subscriptionId)
      const provisioningResponse = await apiClient.getBatchProvisioningStatus(subscriptionIds)

      // create map of subscription id to provisioning status
      const provisioningMap: Record<string, ProvisioningStatus> = {}
      provisioningResponse.statuses.forEach((status: ProvisioningStatusResponse) => {
        provisioningMap[status.subscriptionId] = status.status
      })

      // check minecraft status for each server concurrently
      const minecraftPromises = servers.map(async server => ({
        address: server.address,
        subscriptionId: server.subscriptionId,
        minecraftStatus: await checkMinecraftStatus(server.address)
      }))

      const minecraftResults = await Promise.allSettled(minecraftPromises)

      if (!mountedRef.current) return

      // update all statuses at once
      setServerStatuses(prev => {
        const updated = { ...prev }

        servers.forEach((server, index) => {
          const minecraftResult = minecraftResults[index]
          const provisioningStatus = provisioningMap[server.subscriptionId] || ProvisioningStatus.FAILED

          updated[server.address] = {
            provisioningStatus,
            machineOnline: provisioningStatus === ProvisioningStatus.READY,
            minecraftStatus: minecraftResult.status === 'fulfilled'
                ? minecraftResult.value.minecraftStatus
                : { online: false, lastUpdated: new Date().toISOString() },
            isChecking: false,
            lastChecked: Date.now()
          }
        })

        return updated
      })
    } catch (error) {
      console.error('batch status check failed:', error)

      if (!mountedRef.current) return

      // set all to not checking on error
      setServerStatuses(prev => {
        const updated = { ...prev }
        servers.forEach(server => {
          if (updated[server.address]) {
            updated[server.address] = {
              ...updated[server.address],
              isChecking: false
            }
          }
        })
        return updated
      })
    }
  }, [apiClient])

  // single server status check
  const refreshStatus = useCallback(async (server: ServerInput) => {
    setServerStatuses(prev => ({
      ...prev,
      [server.address]: {
        ...prev[server.address],
        isChecking: true
      }
    }))

    try {
      // single provisioning status
      const provisioningResponse = await apiClient.getProvisioningStatus(server.subscriptionId)
      const minecraftStatus = await checkMinecraftStatus(server.address)

      if (!mountedRef.current) return

      setServerStatuses(prev => ({
        ...prev,
        [server.address]: {
          provisioningStatus: provisioningResponse.status,
          machineOnline: provisioningResponse.status === ProvisioningStatus.READY,
          minecraftStatus,
          isChecking: false,
          lastChecked: Date.now()
        }
      }))
    } catch (error) {
      console.error('single status check failed:', error)

      if (!mountedRef.current) return

      setServerStatuses(prev => ({
        ...prev,
        [server.address]: {
          ...prev[server.address],
          isChecking: false
        }
      }))
    }
  }, [apiClient])

  // refresh all statuses (used for initial load and periodic refresh)
  const refreshAllStatuses = useCallback(async (servers: ServerInput[]) => {
    await checkBatchStatuses(servers)
  }, [checkBatchStatuses])

  // set up periodic refresh
  useEffect(() => {
    if (initialServers.length === 0) return

    // initial fetch
    refreshAllStatuses(initialServers)

    // periodic refresh
    intervalRef.current = setInterval(() => {
      refreshAllStatuses(initialServers)
    }, refreshInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [initialServers, refreshInterval, refreshAllStatuses])

  // cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const isAnyChecking = Object.values(serverStatuses).some(status => status.isChecking)

  return {
    serverStatuses,
    refreshStatus,
    refreshAllStatuses,
    isAnyChecking
  }
}