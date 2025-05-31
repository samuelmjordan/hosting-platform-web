import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"
import type { PaymentMethod } from "@/app/types"
import {
  createPaymentMethod,
  setDefaultPaymentMethod,
  removeDefaultPaymentMethod,
  removePaymentMethod
} from "@/app/_services/paymentMethodClientService"

interface UsePaymentMethodsReturn {
  methods: PaymentMethod[]
  loading: Set<string>
  isLoading: (id: string) => boolean
  addPaymentMethod: () => Promise<void>
  setDefault: (id: string, displayName: string) => Promise<void>
  removeDefault: (id: string, displayName: string) => Promise<void>
  remove: (id: string, displayName: string) => Promise<void>
}

export function usePaymentMethods(initialMethods: PaymentMethod[]): UsePaymentMethodsReturn {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods)
  const [loadingSet, setLoadingSet] = useState<Set<string>>(new Set())
  
  // Helper to manage loading states
  const setLoading = useCallback((id: string, isLoading: boolean) => {
    setLoadingSet(prev => {
      const next = new Set(prev)
      if (isLoading) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])
  
  const isLoading = useCallback((id: string) => loadingSet.has(id), [loadingSet])
  
  const addPaymentMethod = useCallback(async () => {
    const loadingId = "add"
    setLoading(loadingId, true)
    
    try {
      const checkoutUrl = await createPaymentMethod(
        window.location.href,
        window.location.href
      )
      window.location.href = checkoutUrl
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment method. Please try again.",
        variant: "destructive"
      })
      setLoading(loadingId, false)
    }
  }, [setLoading])
  
  const setDefault = useCallback(async (id: string, displayName: string) => {
    setLoading(id, true)
    
    try {
      await setDefaultPaymentMethod(id)
      
      setMethods(prev => prev.map(method => ({
        ...method,
        is_default: method.id === id
      })))
      
      toast({
        title: "Default payment method updated",
        description: `${displayName} is now your default payment method.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default payment method. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(id, false)
    }
  }, [setLoading])
  
  const removeDefault = useCallback(async (id: string, displayName: string) => {
    setLoading(id, true)
    
    try {
      await removeDefaultPaymentMethod(id)
      
      setMethods(prev => prev.map(method => ({
        ...method,
        is_default: false
      })))
      
      toast({
        title: "Default payment method unset",
        description: `${displayName} has been unset as default payment method.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove default payment method. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(id, false)
    }
  }, [setLoading])
  
  const remove = useCallback(async (id: string, displayName: string) => {
    setLoading(id, true)
    
    try {
      await removePaymentMethod(id)
      
      setMethods(prev => prev.filter(method => method.id !== id))
      
      toast({
        title: "Payment method removed",
        description: `${displayName} has been removed from your account.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove payment method. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(id, false)
    }
  }, [setLoading])
  
  return {
    methods,
    loading: loadingSet,
    isLoading,
    addPaymentMethod,
    setDefault,
    removeDefault,
    remove
  }
}