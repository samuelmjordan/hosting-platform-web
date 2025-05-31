"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Server, Invoice, PaymentMethod } from "@/app/types"
import { BillingOverview } from "./components/BillingOverview"
import { SubscriptionList } from "./components/SubscriptionList"
import { PaymentMethodList } from "./components/PaymentMethodList"
import { BillingHistory } from "./components/BillingHistory"
import { CancelSubscriptionDialog } from "./components/CancelSubscriptionDialog"
import { useBillingTabs } from "./hooks/useBillingTabs"
import { BILLING_TABS } from "./utils/constants"

interface BillingPageProps {
  servers: Server[]
  invoices: Invoice[]
  paymentMethods: PaymentMethod[]
}

export function BillingPage({ servers, invoices, paymentMethods }: BillingPageProps) {
  const { activeTab, setActiveTab } = useBillingTabs()
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean
    server: Server | null
  }>({ open: false, server: null })
  
  const handleCancelRequest = (server: Server) => {
    setCancelDialog({ open: true, server })
  }
  
  const handleCancelConfirm = (server: Server) => {
    // TODO: Actually cancel the subscription via API
    console.log("Canceling subscription:", server.subscription_id)
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
      <BillingOverview servers={servers} />
      
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
            servers={servers} 
            onCancelClick={handleCancelRequest}
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
    </div>
  )
}