import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

// Status configurations
export const SUBSCRIPTION_STATUS = {
  active: {
    label: "active",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800 border-green-200",
    iconClass: "text-green-500"
  },
  past_due: {
    label: "payment past due",
    icon: AlertCircle,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    iconClass: "text-yellow-500"
  },
  unpaid: {
    label: "unpaid",
    icon: AlertCircle,
    className: "bg-red-100 text-red-800 border-red-200",
    iconClass: "text-red-500"
  },
  canceled: {
    label: "canceled",
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200",
    iconClass: "text-red-500"
  }
} as const

// Plan tiers
export const PLAN_STYLES = {
  Wooden: "bg-amber-100 text-amber-800 border-amber-200",
  Iron: "bg-slate-100 text-slate-800 border-slate-200",
  Diamond: "bg-sky-100 text-sky-800 border-sky-200",
  default: "bg-gray-100 text-gray-800 border-gray-200"
} as const

// Region mappings
export const REGIONS = {
  WEST_EUROPE: { label: "europe", flag: "🇪🇺" },
  EAST_EUROPE: { label: "europe", flag: "🇪🇺" },
  default: { label: "Unknown", flag: "🌐" }
} as const

// Payment method icons - consolidating all the CDN madness
export const PAYMENT_ICONS = {
  // Card brands
  visa: "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/visa.svg",
  mastercard: "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/mastercard.svg",
  amex: "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/amex.svg",
  discover: "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/discover.svg",
  diners: "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/diners.svg",
  jcb: "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/jcb.svg",
  unionpay: "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/unionpay.svg",
  
  // Digital wallets - using simple-icons
  google: "https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/google.svg",
  apple: "https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/apple.svg",
  samsung: "https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/samsung.svg",
  googlepay: "https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/googlepay.svg",
  applepay: "https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/applepay.svg",
  samsungpay: "https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/samsungpay.svg"
} as const

// Wallet display config
export const WALLET_CONFIG = {
  google_pay: {
    icon: PAYMENT_ICONS.google,
    container: "bg-white border-2 border-gray-200",
    imageClass: "h-6 w-6"
  },
  apple_pay: {
    icon: PAYMENT_ICONS.apple,
    container: "bg-black",
    imageClass: "h-4 w-5",
    imageStyle: { filter: 'brightness(0) invert(1)' }
  },
  samsung_pay: {
    icon: PAYMENT_ICONS.samsung,
    container: "bg-white border-2 border-gray-200",
    imageClass: "h-6 w-6"
  }
} as const

// Tab configuration
export const BILLING_TABS = {
  subscription: "subscriptions",
  payment: "payment methods",
  history: "billing history"
} as const

export type BillingTab = keyof typeof BILLING_TABS