import { CreditCard, Wallet } from "lucide-react"
import { PAYMENT_ICONS, WALLET_CONFIG } from "../utils/constants"
import { JSX } from "react"

interface PaymentIconProps {
  type: "card" | "google_pay" | "apple_pay" | "samsung_pay"
  brand?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const containerSizes = {
  sm: "w-8 h-6",
  md: "w-10 h-10",
  lg: "w-12 h-12"
}

export function PaymentIcon({ type, size = "md", className = "" }: PaymentIconProps) {
  // for cards, always show the generic card icon (not brand specific)
  if (type === "card") {
    return (
        <div className={`${containerSizes[size]} bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 rounded-lg flex items-center justify-center shadow-sm ${className}`}>
          <CreditCard className="h-5 w-5 text-white" />
        </div>
    )
  }

  // handle digital wallets
  if (type in WALLET_CONFIG) {
    const config = WALLET_CONFIG[type as keyof typeof WALLET_CONFIG]

    return (
        <div className={`${containerSizes[size]} ${config.container} rounded-lg flex items-center justify-center shadow-sm dark:shadow-md ${className}`}>
          <img
              src={config.icon}
              alt={type.replace('_', ' ')}
              className={config.imageClass}
              style={'imageStyle' in config ? config.imageStyle : undefined}
          />
        </div>
    )
  }

  // default card icon
  return (
      <div className={`${containerSizes[size]} bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 rounded-lg flex items-center justify-center shadow-sm ${className}`}>
        <CreditCard className="h-5 w-5 text-white" />
      </div>
  )
}

// inline wallet icon for displaying in payment method cards
export function WalletIcon({ wallet, className = "" }: { wallet: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    google_pay: (
        <img
            src={PAYMENT_ICONS.googlepay}
            alt="google pay"
            className={`h-6 w-6 object-contain ${className}`}
        />
    ),
    apple_pay: (
        <div className={`inline-flex items-center justify-center w-6 h-6 bg-black dark:bg-black rounded ${className}`}>
          <img
              src={PAYMENT_ICONS.applepay}
              alt="apple pay"
              className="h-4 w-5 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
    ),
    samsung_pay: (
        <img
            src={PAYMENT_ICONS.samsungpay}
            alt="samsung pay"
            className={`h-6 w-6 object-contain ${className}`}
        />
    )
  }

  return icons[wallet] ?? (
      <div className={`inline-flex items-center justify-center w-6 h-6 bg-gray-500 dark:bg-gray-600 rounded ${className}`}>
        <Wallet className="h-3 w-3 text-white" />
      </div>
  )
}