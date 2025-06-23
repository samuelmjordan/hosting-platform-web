import type { CurrencyAmount, Server, SupportedCurrency } from "@/app/types"

/**
 * Format currency amounts properly
 */
export const formatCurrency = (amount: CurrencyAmount): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: amount.type,
  }).format(amount.value / 100)
}

/**
 * Format timestamps to readable dates
 * @param timestamp - Unix timestamp in nanoseconds (why tho?)
 */
export const formatDate = (timestamp: number): string => {
  if (timestamp === 0) return "N/A"
  
  return new Date(timestamp * 1000000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).toLowerCase()
}

/**
 * Format region codes to human readable
 */
export const formatRegion = (regionCode: string): string => {
  const regions: Record<string, string> = {
    WEST_EUROPE: "west Europe",
    EAST_EUROPE: "east Europe",
  }
  
  return regions[regionCode] ?? regionCode
}

/**
 * Get region flag emoji
 */
export const getRegionFlag = (regionCode: string): string => {
  const flags: Record<string, string> = {
    WEST_EUROPE: "🇪🇺",
    EAST_EUROPE: "🇪🇺",
  }
  
  return flags[regionCode] ?? "🌐"
}