import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import type { Server } from "@/app/types"
import { cancelSubscription, uncancelSubscription } from "@/app/_services/protected/subscriptionClientService"

interface UseSubscriptionsReturn {
  servers: Server[]
  loading: Set<string>
  isLoading: (subscriptionId: string) => boolean
  cancelSubscription: (server: Server) => Promise<void>
  uncancelSubscription: (server: Server) => Promise<void>
}

export function useSubscriptions(initialSubscriptions: Server[]): UseSubscriptionsReturn {
  const [subscriptions, setSubscriptions] = useState<Server[]>(initialSubscriptions)
  const [loadingSet, setLoadingSet] = useState<Set<string>>(new Set())
  const router = useRouter()
  
  // Helper to manage loading states
  const setLoading = useCallback((subscriptionId: string, isLoading: boolean) => {
    setLoadingSet(prev => {
      const next = new Set(prev)
      if (isLoading) {
        next.add(subscriptionId)
      } else {
        next.delete(subscriptionId)
      }
      return next
    })
  }, [])
  
  const isLoading = useCallback((subscriptionId: string) => {
    return loadingSet.has(subscriptionId)
  }, [loadingSet])
  
  const handleCancelSubscription = useCallback(async (server: Server) => {
    setLoading(server.subscription_id, true)
    
    try {
      await cancelSubscription(server.subscription_id)

      setSubscriptions(prev => prev.map(subscription => ({
        ...subscription,
        cancel_at_period_end: subscription.subscription_id === server.subscription_id 
          ? true 
          : subscription.cancel_at_period_end
      })))
      
      toast({
        title: "Subscription canceled",
        description: `Your ${server.server_name} subscription has been canceled and will end on ${new Date(server.current_period_end * 1000000).toLocaleDateString()}.`,
      })
      
      // Refresh the page to show updated subscription status
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(server.subscription_id, false)
    }
  }, [setLoading, router])
  
  const handleUncancelSubscription = useCallback(async (server: Server) => {
    setLoading(server.subscription_id, true)
    
    try {
      await uncancelSubscription(server.subscription_id)

      setSubscriptions(prev => prev.map(subscription => ({
        ...subscription,
        cancel_at_period_end: subscription.subscription_id === server.subscription_id 
          ? false 
          : subscription.cancel_at_period_end
      })))
      
      toast({
        title: "Subscription resumed",
        description: `Your ${server.server_name} subscription has been resumed and will continue to renew.`,
      })
      
      // Refresh the page to show updated subscription status
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resume subscription. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(server.subscription_id, false)
    }
  }, [setLoading, router])
  
  return {
    servers: subscriptions,
    loading: loadingSet,
    isLoading,
    cancelSubscription: handleCancelSubscription,
    uncancelSubscription: handleUncancelSubscription
  }
}