// Domain and validation constants
export const FIXED_DOMAIN = ".node.samuelmjordan.dev"
export const MAX_SUBDOMAIN_LENGTH = 58
export const MAX_TITLE_LENGTH = 32
export const STATUS_CHECK_INTERVAL = 1000 * 10 // 10 seconds

// Region mappings
export const REGION_FLAGS: Record<string, string> = {
  WEST_EUROPE: "🇪🇺",
  EAST_EUROPE: "🇪🇺",
}

export const REGION_NAMES: Record<string, string> = {
  WEST_EUROPE: "EU West",
  EAST_EUROPE: "EU East",
}

// Plan color schemes
export const PLAN_COLORS: Record<string, string> = {
  Wooden: "from-amber-400 to-amber-600",
  Iron: "from-slate-400 to-slate-600",
  Diamond: "from-cyan-400 to-blue-600",
  default: "from-gray-400 to-gray-600",
}

// Validation patterns
export const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/