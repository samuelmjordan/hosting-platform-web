import { CurrencyAmount } from "@/app/types"
import { REGION_FLAGS, REGION_NAMES, PLAN_COLORS } from "./constants"

export const formatDate = (timestamp: number) => {
  if (!timestamp) return "N/A"
  return new Date(timestamp * 1000000).toLocaleDateString()
}

export const formatCurrency = (amount: CurrencyAmount): string => {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: amount.type,
  }).format(amount.value / 100)
}

export const getRegionFlag = (regionCode: string) => {
  return REGION_FLAGS[regionCode] || "🌐"
}

export const formatRegion = (regionCode: string) => {
  return REGION_NAMES[regionCode] || regionCode
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