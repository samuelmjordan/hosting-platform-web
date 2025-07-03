import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Cpu, MemoryStick, HardDrive, CreditCard, Receipt, ArrowLeft } from "lucide-react"
import {Server, Plan, SupportedCurrency} from "@/app/types"
import { formatCurrency } from "../utils/formatters"
import {UpgradeConfirmation, UpgradePreview} from "@/app/_services/protected/client/subscriptionSpecificationService";

interface UpgradeServerDialogProps {
  server: Server | null
  plans: Plan[]
  isOpen: boolean
  onClose: () => void
  onPreview: (serverId: string, specificationId: string) => Promise<UpgradePreview>
  onConfirm: (serverId: string, specificationId: string) => Promise<UpgradeConfirmation>
}

type DialogStep = "select" | "preview" | "success"

export function UpgradeServerDialog({
  server,
  plans,
  isOpen,
  onClose,
  onPreview,
  onConfirm
}: UpgradeServerDialogProps) {
  const [selectedSpecification, setSelectedSpecification] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<DialogStep>("select")
  const [upgradePreview, setUpgradePreview] = useState<UpgradePreview | null>(null)
  const [upgradeConfirmation, setUpgradeConfirmation] = useState<UpgradeConfirmation | null>(null)

  useEffect(() => {
    if (server) {
      const currentPlan = plans.find(plan => plan.specification.specification_id === server.specification_title)
      setSelectedSpecification(currentPlan?.specification.specification_id || "")
    }
  }, [server, plans])

  useEffect(() => {
    if (!isOpen) {
      setStep("select")
      setUpgradePreview(null)
      setUpgradeConfirmation(null)
    }
  }, [isOpen])

  const handlePreview = async () => {
    if (!server || !selectedSpecification) return

    setIsSubmitting(true)
    try {
      const preview = await onPreview(server.subscription_id, selectedSpecification)
      setUpgradePreview(preview)
      setStep("preview")
    } catch (error) {
      console.error("preview failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirm = async () => {
    if (!server || !selectedSpecification) return

    setIsSubmitting(true)
    try {
      const confirmation = await onConfirm(server.subscription_id, selectedSpecification)
      setUpgradeConfirmation(confirmation)
      setStep("success")
    } catch (error) {
      console.error("upgrade failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setStep("select")
    setUpgradePreview(null)
    setUpgradeConfirmation(null)
  }

  const filteredPlans = server
      ? plans.filter((plan) => plan.price.currency === server.currency)
      : []

  const selectedPlan = plans.find(plan => plan.specification.specification_id === selectedSpecification)
  const isCurrentPlan = selectedPlan?.specification.title === server?.specification_title

  if (step === "select") {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upgrade Server</DialogTitle>
              <DialogDescription>
                Choose a new plan for your server. You'll see a preview of charges before confirming.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup value={selectedSpecification} onValueChange={setSelectedSpecification}>
                {filteredPlans.map((plan) => {
                  const isPlanCurrent = plan.specification.title === server?.specification_title
                  const currentPrice = server?.minor_amount || 0
                  const newPrice = plan.price.minor_amount
                  const isDowngrade = newPrice < currentPrice

                  return (
                      <div
                          key={plan.specification.specification_id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                              isPlanCurrent ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50"
                          }`}
                      >
                        <RadioGroupItem
                            value={plan.specification.specification_id}
                            id={plan.specification.specification_id}
                            disabled={isPlanCurrent}
                        />
                        <Label htmlFor={plan.specification.specification_id} className="flex-grow cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{plan.specification.title}</span>
                                {isPlanCurrent && (
                                    <Badge variant="secondary" className="text-xs">
                                      Current Plan
                                    </Badge>
                                )}
                                {isDowngrade && !isPlanCurrent && (
                                    <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                                      Downgrade
                                    </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{plan.specification.caption}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Cpu className="h-3 w-3" />
                              {plan.specification.vcpu} vCPU
                            </span>
                                <span className="flex items-center gap-1">
                              <MemoryStick className="h-3 w-3" />
                                  {plan.specification.ram_gb} GB RAM
                            </span>
                                <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                                  {plan.specification.ssd_gb} GB SSD
                            </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatCurrency({ type: server?.currency || "USD", value: newPrice })}
                              </div>
                              <div className="text-xs text-muted-foreground">per month</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                  )
                })}
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                  onClick={handlePreview}
                  disabled={isSubmitting || !selectedSpecification || isCurrentPlan}
              >
                {isSubmitting ? "Loading..." : "Continue"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
  }

  if (step === "preview") {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upgrade Preview</DialogTitle>
              <DialogDescription>
                Review the charges for upgrading your server.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {/* Current vs New Plan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current plan:</span>
                  <span>{server?.specification_title}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New plan:</span>
                  <span className="font-medium">{selectedPlan?.specification.title}</span>
                </div>
              </div>

              <Separator />

              {/* Billing Details */}
              {upgradePreview && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Billing Summary</span>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current monthly amount:</span>
                        <span>
                          {formatCurrency({
                            type: upgradePreview.currency,
                            value: upgradePreview.old_monthly_amount
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>New monthly amount:</span>
                        <span>
                          {formatCurrency({
                            type: upgradePreview.currency,
                            value: upgradePreview.new_monthly_amount
                          })}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm font-medium">
                        <span>Immediate charge:</span>
                        <span>
                          {formatCurrency({
                            type: upgradePreview.currency as SupportedCurrency,
                            value: upgradePreview.immediate_charge
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You'll be charged the prorated amount for the upgrade, and your next billing cycle will be at the new rate.
                    </p>
                  </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("select")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleConfirm} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Upgrade"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
  }

  if (step === "success") {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upgrade Complete</DialogTitle>
              <DialogDescription>
                Your server has been successfully upgraded.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <Receipt className="h-5 w-5" />
                <span className="font-medium">Upgrade Successful</span>
              </div>

              {upgradeConfirmation && (
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Amount charged:</span>
                      <span className="font-medium">
                        {formatCurrency({
                          type: upgradeConfirmation.currency,
                          value: upgradeConfirmation.charged_amount
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>New monthly amount:</span>
                      <span>
                        {formatCurrency({
                          type: upgradeConfirmation.currency,
                          value: upgradeConfirmation.new_monthly_amount
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Invoice ID:</span>
                      <span className="font-mono text-xs">{upgradeConfirmation.invoice_id}</span>
                    </div>
                  </div>
              )}

              <p className="text-sm text-muted-foreground">
                Your server is now running on the new plan. Changes will take effect within a few minutes.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
  }

  return null
}