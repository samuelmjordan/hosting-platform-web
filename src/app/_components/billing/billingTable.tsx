"use client"

import { useState } from "react"
import { CalendarIcon, CreditCard, Download, Package, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
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
import type { CurrencyAmount, Invoice, Server, SupportedCurrency } from "@/app/types"

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
}

export function BillingComponent({ servers, invoices }: BillingTableProps) {
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
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-all">
                  <div className="flex items-center">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-full mr-4">
                      <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-muted-foreground text-sm">Expires 12/2025</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdatePaymentMethod} className="shadow-sm hover:shadow transition-all">
                Update Payment Method
              </Button>
            </CardFooter>
          </Card>
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
