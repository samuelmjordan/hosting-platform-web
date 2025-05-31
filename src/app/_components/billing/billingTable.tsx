"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { createPaymentMethod, setDefaultPaymentMethod, removeDefaultPaymentMethod, removePaymentMethod } from "@/app/_services/paymentMethodClientService";

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

const getBrandIcon = (brand: string) => {
  switch (brand) {
    case "visa":
      return (
        <img 
          src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1ecfd6f/svg/color/visa.svg"
          alt="Visa"
          className="h-6 w-10 object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = "https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/visa.svg"
          }}
        />
      )
    case "mastercard":
      return (
        <img 
          src="https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/mastercard.svg"
          alt="Mastercard"
          className="h-6 w-10 object-contain"
        />
      )
    case "amex":
      return (
        <img 
          src="https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/amex.svg"
          alt="American Express"
          className="h-6 w-10 object-contain"
        />
      )
    case "discover":
      return (
        <img 
          src="https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/discover.svg"
          alt="Discover"
          className="h-6 w-10 object-contain"
        />
      )
    case "diners":
      return (
        <img 
          src="https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/diners.svg"
          alt="Diners Club"
          className="h-6 w-10 object-contain"
        />
      )
    case "jcb":
      return (
        <img 
          src="https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/jcb.svg"
          alt="JCB"
          className="h-6 w-10 object-contain"
        />
      )
    case "unionpay":
      return (
        <img 
          src="https://cdn.jsdelivr.net/npm/payment-icons@1.2.1/min/flat/unionpay.svg"
          alt="UnionPay"
          className="h-6 w-10 object-contain"
        />
      )
    default:
      return (
        <div className="inline-flex items-center justify-center w-10 h-6 bg-gray-100 border border-gray-300 rounded">
          <CreditCard className="h-4 w-4 text-gray-600" />
        </div>
      )
  }
}

const getWalletDisplayIcon = (wallet: string) => {
  switch (wallet) {
    case "google_pay":
      return (
        <img 
          src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/googlepay.svg"
          alt="Google Pay"
          className="h-6 w-6 object-contain"
        />
      )
    case "apple_pay":
      return (
        <div className="inline-flex items-center justify-center w-6 h-6 bg-black rounded">
          <img 
            src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/applepay.svg"
            alt="Apple Pay"
            className="h-4 w-5 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      )
    case "samsung_pay":
      return (
        <img 
          src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/samsungpay.svg"
          alt="Samsung Pay"
          className="h-6 w-6 object-contain"
        />
      )
    default:
      return (
        <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-500 rounded">
          <Wallet className="h-3 w-3 text-white" />
        </div>
      )
  }
}

const getPaymentTypeIcon = (type: string) => {
  switch (type) {
    case "google_pay":
      return (
        <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
          <img 
            src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/google.svg"
            alt="Google Pay"
            className="h-6 w-6 object-contain"
          />
        </div>
      )
    case "apple_pay":
      return (
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-sm">
          <img 
            src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/apple.svg"
            alt="Apple Pay"
            className="h-4 w-5 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      )
    case "samsung_pay":
      return (
        <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
          <img 
            src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/samsung.svg"
            alt="Samsung Pay"
            className="h-6 w-6 object-contain"
          />
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

export function BillingComponent({ servers, invoices, paymentMethods: initialPaymentMethods }: BillingTableProps) {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const getActiveTab = () => {
    const tab = searchParams.get('tab')
    if (tab && ['subscription', 'payment', 'history'].includes(tab)) {
      return tab
    }
    return 'subscription'
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTab())
  
  useEffect(() => {
    setActiveTab(getActiveTab())
  }, [searchParams])
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    router.push(url.pathname + url.search, { scroll: false })
  }

  const handleCancelSubscription = (server: Server) => {
    toast({
      title: "Subscription canceled",
      description: `Your ${server.server_name} subscription has been canceled and will end at the billing period.`,
    })
    setCancelDialogOpen(false)
  }

  const handleAddPaymentMethod = async () => {
    try {
      setLoading("add")
      const checkoutUrl = await createPaymentMethod(window.location.href, window.location.href)
      window.location.href = checkoutUrl
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment method. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(null)
    }
  }

  const handleSetDefault = async (paymentMethodId: string, displayName: string) => {
    try {
      setLoading(paymentMethodId)
      await setDefaultPaymentMethod(paymentMethodId)
      
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        is_default: method.id === paymentMethodId
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
      setLoading(null)
    }
  }

  const handleRemoveDefault = async (paymentMethodId: string, displayName: string) => {
    try {
      setLoading(paymentMethodId)
      await removeDefaultPaymentMethod(paymentMethodId)
      
      setPaymentMethods(prev => prev.map(method => ({
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
      setLoading(null)
    }
  }

  const handleRemovePaymentMethod = async (paymentMethodId: string, displayName: string) => {
    try {
      setLoading(paymentMethodId)
      await removePaymentMethod(paymentMethodId)
      
      setPaymentMethods(prev => prev.filter(method => method.id !== paymentMethodId))
      
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
      setLoading(null)
    }
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
                  {nextServerToPay?.server_name}{nextServerToPay && ": "}
                  {nextServerToPay && formatCurrency({
                    type: nextServerToPay?.currency || "USD",
                    value: nextServerToPay?.minor_amount || 0,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                  <Button 
                    className="shadow-sm hover:shadow transition-all"
                    onClick={handleAddPaymentMethod}
                    disabled={loading === "add"}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    {loading === "add" ? "Adding..." : "Add Payment Method"}
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
                      <Button onClick={handleAddPaymentMethod} disabled={loading === "add"}>
                        {loading === "add" ? "Adding..." : "Add Payment Method"}
                      </Button>
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
                                  onClick={() => handleSetDefault(method.id, method.display_name)}
                                  disabled={loading === method.id}
                                >
                                  {loading === method.id ? "Setting..." : "Set as Default"}
                                </Button>
                              )}

                              {method.is_default && paymentMethods.length > 1 && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs text-red-600 hover:text-red-700"
                                      disabled={loading === method.id}
                                    >
                                      Unset Default
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Unset Default Payment Method</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to unset {method.display_name} as the default payment method?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline">Cancel</Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleRemoveDefault(method.id, method.display_name)}
                                        disabled={loading === method.id}
                                      >
                                        {loading === method.id ? "Unsetting..." : "Unset Default"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs text-red-600 hover:text-red-700"
                                    disabled={loading === method.id}
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
                                      onClick={() => handleRemovePaymentMethod(method.id, method.display_name)}
                                      disabled={loading === method.id}
                                    >
                                      {loading === method.id ? "Removing..." : "Remove Method"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
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
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium">Credit Cards</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-white border border-gray-200 rounded-md flex items-center justify-center">
                    <img 
                      src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/google.svg"
                      alt="Google Pay"
                      className="h-6 w-6 object-contain"
                    />
                    </div>
                    <span className="text-sm font-medium">Google Pay</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                      <img 
                        src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/apple.svg"
                        alt="Apple Pay"
                        className="h-4 w-5 object-contain"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />  
                    </div>
                    <span className="text-sm font-medium">Apple Pay</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <img 
                        src="https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/samsung.svg"
                        alt="Samsung Pay"
                        className="h-6 w-6 object-contain"
                      />
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