"use client"

import { useState } from "react"
import { CalendarIcon, CreditCard, Download, Package, AlertCircle, CheckCircle2, XCircle, Wallet, Check, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import type { CurrencyAmount, Invoice, PaymentMethod, Server, SupportedCurrency } from "@/app/types"

const formatCurrency = (amount: CurrencyAmount): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: amount.type,
  }).format(amount.value / 100)
}

const formatDate = (timestamp: number) => {
  if (timestamp == 0) return "N/A"
  return new Date(timestamp * 1000000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const getSubscriptionStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200"
    case "past_due":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "unpaid":
    case "canceled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getFormattedSubscriptionStatus = (status: string) => {
  switch (status) {
    case "active":
      return "Active"
    case "past_due":
      return "Payment Past Due"
    case "unpaid":
      return "Unpaid"
    case "canceled":
      return "Canceled"
    default:
      return "Unknown"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle2 className="h-4 w-4 mr-1" />
    case "past_due":
    case "unpaid":
    case "canceled":
      return <AlertCircle className="h-4 w-4 mr-1" />
    default:
      return null
  }
}

const formatRegion = (regionCode: string) => {
  switch (regionCode) {
    case "WEST_EUROPE":
      return "West Europe"
    case "EAST_EUROPE":
      return "East Europe"
    default:
      return regionCode
  }
}

const getRegionFlag = (regionCode: string) => {
  switch (regionCode) {
    case "WEST_EUROPE":
      return "🇪🇺"
    case "EAST_EUROPE":
      return "🇪🇺"
    default:
      return "🌐"
  }
}

const getPlanColor = (planName: string) => {
  switch (planName) {
    case "Wooden":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "Iron":
      return "bg-slate-100 text-slate-800 border-slate-200"
    case "Diamond":
      return "bg-sky-100 text-sky-800 border-sky-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getPaymentTypeIcon = (type: string) => {
  switch (type) {
    case "google_pay":
      return (
        <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="#4285F4"
            />
          </svg>
        </div>
      )
    case "apple_pay":
      return (
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        </div>
      )
    case "samsung_pay":
      return (
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v-.07zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
      )
    case "card":
    default:
      return (
        <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-sm">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
      )
  }
}

const getBrandIcon = (brand: string) => {
  switch (brand) {
    case "visa":
      return (
        <div className="inline-flex items-center justify-center w-10 h-6 bg-blue-600 text-white text-xs font-bold rounded">
          <svg width="32" height="20" viewBox="0 0 32 20" fill="white">
            <path d="M13.8 2.2l-2.6 15.6h-2.7L11.1 2.2h2.7zm7.466 10.12c.01-1.37-1.88-2.42-2.96-2.94-.66-.32-1.07-.54-1.07-.87 0-.3.37-.62 1.17-.62 1.29-.02 2.22.27 2.95.57l.53-2.46c-.72-.26-1.84-.54-3.11-.54-2.93 0-4.99 1.48-5.01 3.6-.02 1.57 1.48 2.44 2.61 2.96 1.16.54 1.55.88 1.55 1.36 0 .73-.92 1.05-1.77 1.05-1.49 0-2.28-.21-3.51-.74l-.62 2.88c.8.35 2.28.65 3.81.67 3.11 0 5.14-1.46 5.16-3.72l.01-.01zm5.16-7.9c-.64 0-1.18.35-1.42.89L20.1 17.8h2.93s.48-1.26.59-1.54c.32 0 3.18.01 3.59.01.08.36.35 1.53.35 1.53h2.59L27.426 4.42h-1.99zm.35 6.26c.23-.58 1.1-2.82 1.1-2.82-.02.03.23-.59.37-.97l.19.9s.54 2.46.65 2.97l-2.31-.08zm-12.62-6.26L11.566 14.8l-.29-1.43c-.5-1.61-2.06-3.35-3.81-4.22l2.41 8.64h2.96l4.41-10.57h-2.94z" />
          </svg>
        </div>
      )
    case "mastercard":
      return (
        <div className="inline-flex items-center justify-center w-10 h-6 bg-red-500 text-white text-xs font-bold rounded">
          <svg width="32" height="20" viewBox="0 0 32 20" fill="white">
            <circle cx="11" cy="10" r="7" fill="#EB001B" />
            <circle cx="21" cy="10" r="7" fill="#F79E1B" />
            <path
              d="M16 6.5c1.26 1.1 2.06 2.73 2.06 4.5s-.8 3.4-2.06 4.5c-1.26-1.1-2.06-2.73-2.06-4.5s.8-3.4 2.06-4.5z"
              fill="#FF5F00"
            />
          </svg>
        </div>
      )
    case "amex":
      return (
        <div className="inline-flex items-center justify-center w-10 h-6 bg-blue-700 text-white text-xs font-bold rounded">
          <svg width="32" height="20" viewBox="0 0 32 20" fill="white">
            <path d="M6.26 4.2h3.38l.77 1.82.78-1.82h3.38v7.6h-2.1V7.4l-1.06 2.4h-1.01L9.34 7.4v4.4h-2.1V4.2h-.98zm8.5 0h5.7v1.6h-3.6v1.2h3.5v1.5h-3.5v1.7h3.7v1.6h-5.8V4.2zm7.8 0h2.3l1.4 2.8 1.4-2.8h2.3l-2.7 4.8v2.8h-2.1V9l-2.6-4.8z" />
          </svg>
        </div>
      )
    case "discover":
      return (
        <div className="inline-flex items-center justify-center w-10 h-6 bg-orange-500 text-white text-xs font-bold rounded">
          <svg width="32" height="20" viewBox="0 0 32 20" fill="white">
            <path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm0 25.2c-6.18 0-11.2-5.02-11.2-11.2S9.82 4.8 16 4.8 27.2 9.82 27.2 16 22.18 27.2 16 27.2z" />
            <path d="M16 7.2c-4.86 0-8.8 3.94-8.8 8.8s3.94 8.8 8.8 8.8 8.8-3.94 8.8-8.8-3.94-8.8-8.8-8.8z" />
          </svg>
        </div>
      )
    default:
      return (
        <div className="inline-flex items-center justify-center w-10 h-6 bg-gray-500 text-white text-xs font-bold rounded">
          <CreditCard className="h-4 w-4" />
        </div>
      )
  }
}

const getWalletDisplayIcon = (wallet: string) => {
  switch (wallet) {
    case "google_pay":
      return (
        <div className="inline-flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="#4285F4"
            />
          </svg>
        </div>
      )
    case "apple_pay":
      return (
        <div className="inline-flex items-center justify-center w-6 h-6 bg-black rounded">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        </div>
      )
    case "samsung_pay":
      return (
        <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 rounded">
          <Smartphone className="h-3 w-3 text-white" />
        </div>
      )
    default:
      return (
        <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-500 rounded">
          <CreditCard className="h-3 w-3 text-white" />
        </div>
      )
  }
}

const getCurrency = (servers: Server[]) => servers[0]?.currency ?? ("USD" as SupportedCurrency)

const sumAmount = (servers: Server[]) =>
  servers.map((server) => server.minor_amount).reduce((partialSum, a) => partialSum + a, 0)

const getNextPaymentDate = (servers: Server[]) =>
  servers
    .filter((server) => !server.cancel_at_period_end && server.subscription_status === "active")
    .reduce(
      (earliest, server) => (!earliest || server.current_period_end < earliest.current_period_end ? server : earliest),
      null as Server | null,
    )

interface BillingTableProps {
  servers: Server[]
  invoices: Invoice[]
  paymentMethods: PaymentMethod[]
}

export function BillingComponent({ servers, invoices, paymentMethods }: BillingTableProps) {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const handleCancelSubscription = (server: Server) => {
    toast({
      title: "Subscription canceled",
      description: `Your ${server.server_name} subscription has been canceled and will end at the billing period.`,
    })
    setCancelDialogOpen(false)
  }

  const handleUpdatePaymentMethod = () => {
    toast({
      title: "Redirecting to payment update",
      description: "You'll be redirected to securely update your payment method.",
    })
  }

  const nextServerToPay = getNextPaymentDate(servers)
  const activeServers = servers.filter((server) => server.subscription_status === "active")

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing Management</h1>
        <p className="text-muted-foreground mt-2">Manage your subscription, payment methods, and billing history</p>
      </div>

      <Card className="mb-8 overflow-hidden border-0 shadow-md">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardContent className="pt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Monthly Billing</p>
                <p className="text-3xl font-bold">
                  {formatCurrency({ type: getCurrency(servers), value: sumAmount(servers) })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                <p className="text-3xl font-bold">{activeServers.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Next Payment</p>
                <p className="text-3xl font-bold">{formatDate(nextServerToPay?.current_period_end ?? 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {nextServerToPay?.server_name}:{" "}
                  {formatCurrency({
                    type: nextServerToPay?.currency || "USD",
                    value: nextServerToPay?.minor_amount || 0,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Subscriptions</h2>
              <Link href="/store">
                <Button className="shadow-sm transition-all hover:shadow">
                  <Package className="mr-2 h-4 w-4" />
                  Add New Subscription
                </Button>
              </Link>
            </div>

            {servers.map((server) => (
              <Card key={server.subscription_id} className="overflow-hidden shadow-sm hover:shadow transition-all">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                      <CardTitle className="text-xl mb-2">{server.server_name}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${getSubscriptionStatusColor(
                            server.subscription_status,
                          )}`}
                        >
                          {getStatusIcon(server.subscription_status)}
                          {getFormattedSubscriptionStatus(server.subscription_status)}
                        </Badge>
                        <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 rounded-md">
                          <span className="text-base leading-none">{getRegionFlag(server.region_code)}</span>
                          {formatRegion(server.region_code)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${getPlanColor(
                            server.specification_title,
                          )}`}
                        >
                          {server.specification_title}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {formatCurrency({ type: server.currency, value: server.minor_amount })}
                      </p>
                      <p className="text-muted-foreground text-sm">per month</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-4">
                    {server.cname_record_name && <p className="text-sm text-muted-foreground">{server.cname_record_name}</p>}

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Subscription ID</span>
                          <span className="text-sm font-medium">{server.subscription_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Billing cycle</span>
                          <span className="text-sm font-medium">Monthly</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Auto-Renew</span>
                          <div className="flex items-center">
                            {!server.cancel_at_period_end ? (
                              <>
                              <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />
                              <span className="text-sm font-medium">On</span>
                              </>
                            ) : (
                              <>
                              <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
                              <span className="text-sm font-medium text-destructive">Off</span>
                              </>
                            )}
                          </div>
                        </div>
                        {server.cancel_at_period_end ? (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Cancels at</span>
                            <span className="text-sm font-medium flex items-center text-destructive">
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              {formatDate(server.current_period_end)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Next billing date</span>
                            <span className="text-sm font-medium flex items-center">
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              {formatDate(server.current_period_end)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  {!server.cancel_at_period_end && server.subscription_status === "active" && (
                    <Dialog
                      open={cancelDialogOpen && selectedServer?.subscription_id === server.subscription_id}
                      onOpenChange={(open) => {
                        setCancelDialogOpen(open)
                        if (open) setSelectedServer(server)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="shadow-sm hover:shadow transition-all">
                          Cancel Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel your {server.server_name} subscription?</DialogTitle>
                          <DialogDescription>
                            Your subscription will remain active until the end of your current billing period on{" "}
                            {formatDate(server.current_period_end)}.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                            Keep Subscription
                          </Button>
                          <Button variant="destructive" onClick={() => handleCancelSubscription(server)}>
                            Cancel Subscription
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods and billing preferences</CardDescription>
                  </div>
                  <Button className="shadow-sm hover:shadow transition-all">
                    <Package className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No payment methods</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add a payment method to manage your subscriptions
                      </p>
                      <Button>Add Payment Method</Button>
                    </div>
                  ) : (
                    paymentMethods.map((method) => (
                      <Card
                        key={method.id}
                        className={`transition-all hover:shadow-md ${
                          method.is_default ? "ring-2 ring-blue-500 ring-opacity-20 bg-blue-50/50" : ""
                        } ${!method.is_active ? "opacity-60" : ""}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getPaymentTypeIcon(method.type)}

                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">{method.display_name}</h3>
                                  {method.is_default && (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                      <Check className="h-3 w-3 mr-1" />
                                      Default
                                    </Badge>
                                  )}
                                  {!method.is_active && (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                  {Object.entries(method.fields).map(([key, field]) => {
                                    if (field.display_type === "brand_icon") {
                                      return (
                                        <div key={key} className="flex items-center gap-2">
                                          {getBrandIcon(field.value)}
                                          <span className="capitalize">{field.value}</span>
                                        </div>
                                      )
                                    }

                                    if (field.display_type === "wallet_icon") {
                                      return (
                                        <div key={key} className="flex items-center gap-2">
                                          {getWalletDisplayIcon(field.value)}
                                          <span className="capitalize">{field.value.replace("_", " ")}</span>
                                        </div>
                                      )
                                    }

                                    if (field.display_type === "masked") {
                                      return (
                                        <div key={key} className="flex items-center gap-1">
                                          {field.label && <span>{field.label}</span>}
                                          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                                            •••• {field.value}
                                          </span>
                                        </div>
                                      )
                                    }

                                    if (field.display_type === "text" && field.label) {
                                      return (
                                        <div key={key} className="flex items-center gap-1">
                                          <span>{field.label}</span>
                                          <span className="font-medium">{field.value}</span>
                                        </div>
                                      )
                                    }

                                    return null
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {!method.is_default && method.is_active && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    toast({
                                      title: "Default payment method updated",
                                      description: `${method.display_name} is now your default payment method.`,
                                    })
                                  }}
                                >
                                  Set as Default
                                </Button>
                              )}

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Payment Method</DialogTitle>
                                    <DialogDescription>
                                      Update your {method.display_name} payment method details.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <p className="text-sm text-muted-foreground">
                                      You'll be redirected to a secure page to update your payment method.
                                    </p>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button onClick={handleUpdatePaymentMethod}>Update Method</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              {!method.is_default && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs text-red-600 hover:text-red-700"
                                    >
                                      Remove
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Remove Payment Method</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to remove {method.display_name}? This action cannot be
                                        undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline">Cancel</Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => {
                                          toast({
                                            title: "Payment method removed",
                                            description: `${method.display_name} has been removed from your account.`,
                                          })
                                        }}
                                      >
                                        Remove Method
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Types Info */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Supported Payment Methods</CardTitle>
                <CardDescription>We accept the following payment methods for your convenience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">Credit Cards</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">G</span>
                    </div>
                    <span className="text-sm font-medium">Google Pay</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-gray-800 to-gray-600 rounded flex items-center justify-center">
                      <span className="text-white text-sm">🍎</span>
                    </div>
                    <span className="text-sm font-medium">Apple Pay</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">S</span>
                    </div>
                    <span className="text-sm font-medium">Samsung Pay</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices across all subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((invoice, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-all"
                    >
                      <div>
                        <p className="font-medium">{formatDate(invoice.created_at)}</p>
                        <p className="text-muted-foreground text-sm">{invoice.invoice_number}</p>
                        <p className="text-sm text-muted-foreground mt-1">{invoice.subscription_id}</p>
                      </div>
                      <div className="flex items-center mt-3 sm:mt-0">
                        {invoice.paid ? (
                          <Badge variant="outline" className="mr-4 bg-green-50 text-green-700 border-green-100">
                            Paid
                          </Badge>) : (
                          <Badge variant="outline" className="mr-4 bg-red-50 text-red-700 border-red-100">
                            Unpaid
                          </Badge>
                        )}
                        <p className="font-medium mr-4">{formatCurrency({ type: invoice.currency, value: invoice.minor_amount })}</p>
                        <Link href={invoice.link} target="_blank" className="hover:underline">
                          <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
