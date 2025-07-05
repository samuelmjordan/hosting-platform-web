import { CurrencyAmount } from "@/app/types"
import { PLAN_COLORS } from "./constants"

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

export const getPlanColor = (planName: string) => {
  return PLAN_COLORS[planName] || PLAN_COLORS.default
}

export const validateSubdomain = (subdomain: string): boolean => {
  return subdomain.length >= 3 &&
      /^[a-z0-9]([a-z0-9-]{0,56}[a-z0-9])?$/.test(subdomain.toLowerCase())
}