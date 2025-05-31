"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Server, Invoice, PaymentMethod } from "@/app/types"
import { BillingOverview } from "./components/BillingOverview"
import { SubscriptionList } from "./components/SubscriptionList"
import { PaymentMethodList } from "./components/PaymentMethodList"
import { BillingHistory } from "./components/BillingHistory"
import { CancelSubscriptionDialog } from "./components/CancelSubscriptionDialog"
import { UncancelSubscriptionDialog } from "./components/UncancelSubscriptionDialog"
import { useBillingTabs } from "./hooks/useBillingTabs"
import { useSubscriptions } from "./hooks/useSubscriptions"
import { BILLING_TABS } from "./utils/constants"

interface BillingPageProps {
  servers: Server[]
  invoices: Invoice[]
  paymentMethods: PaymentMethod[]
}

export function BillingPage({ servers, invoices, paymentMethods }: BillingPageProps) {
  const { activeTab, setActiveTab } = useBillingTabs()
  const { servers: newServers, loading, cancelSubscription, uncancelSubscription } = useSubscriptions(servers)
  
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean
    server: Server | null
  }>({ open: false, server: null })
  
  const [uncancelDialog, setUncancelDialog] = useState<{
    open: boolean
    server: Server | null
  }>({ open: false, server: null })
  
  const handleCancelRequest = (server: Server) => {
    setCancelDialog({ open: true, server })
  }

  const handleUncancelRequest = (server: Server) => {
    setUncancelDialog({ open: true, server })
  }
  
  const handleCancelConfirm = async (server: Server) => {
    await cancelSubscription(server)
    setCancelDialog({ open: false, server: null })
  }

  const handleUncancelConfirm = async (server: Server) => {
    await uncancelSubscription(server)
    setUncancelDialog({ open: false, server: null })
  }
  
  return (
    <div className="container max-w-5xl py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>
      
      {/* Billing Overview Card */}
      <BillingOverview servers={newServers} />
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof typeof BILLING_TABS)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {Object.entries(BILLING_TABS).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="subscription">
          <SubscriptionList 
            servers={newServers} 
            onCancelClick={handleCancelRequest}
            onUncancelClick={handleUncancelRequest}
            loadingSubscriptions={loading}
          />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentMethodList initialMethods={paymentMethods} />
        </TabsContent>
        
        <TabsContent value="history">
          <BillingHistory invoices={invoices} />
        </TabsContent>
      </Tabs>
      
      {/* Cancel Subscription Dialog */}
      <CancelSubscriptionDialog
        server={cancelDialog.server}
        open={cancelDialog.open}
        onOpenChange={(open) => setCancelDialog({ ...cancelDialog, open })}
        onConfirm={handleCancelConfirm}
      />
      
      {/* Uncancel Subscription Dialog */}
      <UncancelSubscriptionDialog
        server={uncancelDialog.server}
        open={uncancelDialog.open}
        onOpenChange={(open) => setUncancelDialog({ ...uncancelDialog, open })}
        onConfirm={handleUncancelConfirm}
      />
    </div>
  )
}