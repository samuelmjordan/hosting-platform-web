import { CurrencyAmount } from "@/app/types"
import { REGION_FLAGS, REGION_NAMES, PLAN_COLORS } from "./constants"

export const formatDate = (timestamp: number) => {
  if (!timestamp) return "N/A"
  return new Date(timestamp * 1000000).toLocaleDateString()
}

export const formatCurrency = (amount: CurrencyAmount, locale?: string): string => {
  const defaultLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US'
  return new Intl.NumberFormat(locale || defaultLocale, {
    style: "currency",
    currency: amount.type,
  }).format(amount.value / 100)
}

export const getRegionFlag = (regionCode: string) => {
  return "🇪🇺"
}

export const formatRegion = (regionCode: string) => {
  return "Europe"
}

export const getPlanColor = (planName: string) => {
  return PLAN_COLORS[planName] || PLAN_COLORS.default
}

export const validateSubdomain = (subdomain: string, maxLength: number): boolean => {
  if (subdomain.length === 0 || subdomain.length > maxLength) {
    return false
  }
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(subdomain.toLowerCase())
}