import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { BILLING_TABS, type BillingTab } from "../utils/constants"

interface UseBillingTabsReturn {
  activeTab: BillingTab
  setActiveTab: (tab: BillingTab) => void
}

export function useBillingTabs(): UseBillingTabsReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get initial tab from URL or default to 'subscription'
  const getInitialTab = (): BillingTab => {
    const tab = searchParams.get('tab')
    if (tab && tab in BILLING_TABS) {
      return tab as BillingTab
    }
    return 'subscription'
  }
  
  const [activeTab, setActiveTabState] = useState<BillingTab>(getInitialTab())
  
  // Sync tab state with URL changes
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tab in BILLING_TABS && tab !== activeTab) {
      setActiveTabState(tab as BillingTab)
    }
  }, [searchParams, activeTab])
  
  // Update both state and URL when tab changes
  const setActiveTab = useCallback((tab: BillingTab) => {
    setActiveTabState(tab)
    
    // Update URL without causing a page refresh
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    router.push(url.pathname + url.search, { scroll: false })
  }, [router])
  
  return {
    activeTab,
    setActiveTab
  }
}