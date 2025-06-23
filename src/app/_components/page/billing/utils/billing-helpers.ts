import type { Server, SupportedCurrency } from "@/app/types"

/**
 * Get the currency from the first server (assuming all use same currency)
 * Falls back to USD bc murica
 */
export const getCurrency = (servers: Server[]): SupportedCurrency => {
  return servers[0]?.currency ?? "USD"
}

/**
 * Sum up all server costs
 */
export const sumAmount = (servers: Server[]): number => {
  return servers.reduce((sum, server) => sum + server.minor_amount, 0)
}

/**
 * Find the next payment date from active subscriptions
 */
export const getNextPaymentDate = (servers: Server[]): Server | null => {
  const activeServers = servers.filter(
    (server) => !server.cancel_at_period_end && server.subscription_status === "active"
  )
  
  if (activeServers.length === 0) return null
  
  return activeServers.reduce((earliest, server) => 
    !earliest || server.current_period_end < earliest.current_period_end 
      ? server 
      : earliest
  )
}

/**
 * Get active servers count
 */
export const getActiveServersCount = (servers: Server[]): number => {
  return servers.filter(server => server.subscription_status === "active").length
}

/**
 * Sort servers by various criteria
 */
export const sortServers = {
  byName: (a: Server, b: Server) => a.server_name.localeCompare(b.server_name),
  byAmount: (a: Server, b: Server) => b.minor_amount - a.minor_amount,
  byNextPayment: (a: Server, b: Server) => a.current_period_end - b.current_period_end,
  byStatus: (a: Server, b: Server) => {
    const statusOrder: Record<string, number> = { 
      active: 0, 
      past_due: 1, 
      unpaid: 2, 
      canceled: 3 
    }
    return (statusOrder[a.subscription_status] ?? 99) - (statusOrder[b.subscription_status] ?? 99)
  }
}