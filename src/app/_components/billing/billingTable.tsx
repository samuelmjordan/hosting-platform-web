"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, CreditCard, Download, Package } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

export function BillingComponent() {
  const router = useRouter()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("pro")

  const handleCancelSubscription = () => {
    // In a real app, this would call a server action to cancel the subscription via Stripe API
    toast({
      title: "Subscription canceled",
      description: "Your subscription has been canceled and will end at the billing period.",
    })
    setCancelDialogOpen(false)
  }

  const handleUpgradeSubscription = () => {
    // In a real app, this would call a server action to upgrade the subscription via Stripe API
    toast({
      title: "Subscription updated",
      description: `Your subscription has been updated to the ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan.`,
    })
    setUpgradeDialogOpen(false)
  }

  const handleUpdatePaymentMethod = () => {
    // In a real app, this would redirect to Stripe Customer Portal or a custom payment update page
    toast({
      title: "Redirecting to payment update",
      description: "You'll be redirected to securely update your payment method.",
    })
  }

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing Management</h1>
        <p className="text-muted-foreground mt-2">Manage your subscription, payment methods, and billing history</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Monthly Billing</p>
              <p className="text-2xl font-bold">$129.98</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next Payment</p>
              <p className="text-2xl font-bold">June 15, 2025</p>
              <p className="text-xs text-muted-foreground">Pro Plan: $29.99</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Subscriptions</h2>
              <Button>
                <Package className="mr-2 h-4 w-4" />
                Add New Subscription
              </Button>
            </div>

            {/* Subscription 1 */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Pro Plan</CardTitle>
                    <CardDescription>Website Builder Subscription</CardDescription>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground mt-1">All Pro features with unlimited projects</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$29.99</p>
                      <p className="text-muted-foreground text-sm">per month</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Billing cycle</span>
                      <span className="font-medium">Monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next billing date</span>
                      <span className="font-medium flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        June 15, 2025
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subscription ID</span>
                      <span className="font-medium text-sm">sub_1NxYz2CZ6qsJgndJYUuXYZ</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel Subscription</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel your Pro Plan subscription?</DialogTitle>
                      <DialogDescription>
                        Your subscription will remain active until the end of your current billing period on June 15,
                        2025.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Keep Subscription
                      </Button>
                      <Button variant="destructive" onClick={() => {}}>
                        Cancel Subscription
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Change Plan</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change your Pro Plan</DialogTitle>
                      <DialogDescription>
                        Select a new plan below. Your billing will be prorated and adjusted automatically.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Select defaultValue="pro">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic ($9.99/month)</SelectItem>
                          <SelectItem value="pro">Pro ($29.99/month)</SelectItem>
                          <SelectItem value="enterprise">Enterprise ($99.99/month)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Update Subscription</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            {/* Subscription 2 */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Enterprise Plan</CardTitle>
                    <CardDescription>API Services Subscription</CardDescription>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground mt-1">Enterprise API access with priority support</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$99.99</p>
                      <p className="text-muted-foreground text-sm">per month</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Billing cycle</span>
                      <span className="font-medium">Monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next billing date</span>
                      <span className="font-medium flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        June 22, 2025
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subscription ID</span>
                      <span className="font-medium text-sm">sub_2AbCd3EF7ghIjklMNOpQrS</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel Subscription</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel your Enterprise Plan subscription?</DialogTitle>
                      <DialogDescription>
                        Your subscription will remain active until the end of your current billing period on June 22,
                        2025.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Keep Subscription
                      </Button>
                      <Button variant="destructive" onClick={() => {}}>
                        Cancel Subscription
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Change Plan</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change your Enterprise Plan</DialogTitle>
                      <DialogDescription>
                        Select a new plan below. Your billing will be prorated and adjusted automatically.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Select defaultValue="enterprise">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic ($9.99/month)</SelectItem>
                          <SelectItem value="pro">Pro ($29.99/month)</SelectItem>
                          <SelectItem value="enterprise">Enterprise ($99.99/month)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Update Subscription</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="h-10 w-10 mr-4 text-primary" />
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
              <Button onClick={handleUpdatePaymentMethod}>Update Payment Method</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices across all subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "May 15, 2025",
                    amount: "$29.99",
                    status: "Paid",
                    id: "INV-2025-0512",
                    plan: "Pro Plan (Website Builder)",
                  },
                  {
                    date: "May 22, 2025",
                    amount: "$99.99",
                    status: "Paid",
                    id: "INV-2025-0522",
                    plan: "Enterprise Plan (API Services)",
                  },
                  {
                    date: "Apr 15, 2025",
                    amount: "$29.99",
                    status: "Paid",
                    id: "INV-2025-0412",
                    plan: "Pro Plan (Website Builder)",
                  },
                  {
                    date: "Apr 22, 2025",
                    amount: "$99.99",
                    status: "Paid",
                    id: "INV-2025-0422",
                    plan: "Enterprise Plan (API Services)",
                  },
                  {
                    date: "Mar 15, 2025",
                    amount: "$29.99",
                    status: "Paid",
                    id: "INV-2025-0312",
                    plan: "Pro Plan (Website Builder)",
                  },
                  {
                    date: "Mar 22, 2025",
                    amount: "$99.99",
                    status: "Paid",
                    id: "INV-2025-0322",
                    plan: "Enterprise Plan (API Services)",
                  },
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-muted-foreground text-sm">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground mt-1">{invoice.plan}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-4">
                        {invoice.status}
                      </Badge>
                      <p className="font-medium mr-4">{invoice.amount}</p>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
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
