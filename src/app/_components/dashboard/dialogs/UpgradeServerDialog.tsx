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
import { Cpu, MemoryStick, HardDrive } from "lucide-react"
import { Server, Plan } from "@/app/types"
import { formatCurrency } from "../utils/formatters"

interface UpgradeServerDialogProps {
  server: Server | null
  plans: Plan[]
  isOpen: boolean
  onClose: () => void
  onSave: (serverId: string, specificationId: string) => Promise<void>
}

export function UpgradeServerDialog({ server, plans, isOpen, onClose, onSave }: UpgradeServerDialogProps) {
  const [selectedSpecification, setSelectedSpecification] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (server) {
      const currentPlan = plans.find(plan => plan.specification.specification_id === server.specification_title)
      setSelectedSpecification(currentPlan?.specification.specification_id || "")
    }
  }, [server, plans])

  const handleSave = async () => {
    if (!server || !selectedSpecification) return

    const selectedPlan = plans.find(plan => plan.specification.specification_id === selectedSpecification)
    if (!selectedPlan || selectedPlan.specification.title === server.specification_title) return

    setIsSubmitting(true)
    try {
      await onSave(server.subscription_id, selectedSpecification)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredPlans = server
      ? plans.filter((plan) => plan.price.currency === server.currency)
      : []

  return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upgrade Server</DialogTitle>
            <DialogDescription>
              Choose a new plan for your server. Changes will take effect immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup value={selectedSpecification} onValueChange={setSelectedSpecification}>
              {filteredPlans.map((plan) => {
                const isCurrentPlan = plan.specification.title === server?.specification_title
                const currentPrice = server?.minor_amount || 0
                const newPrice = plan.price.minor_amount
                const isDowngrade = newPrice < currentPrice

                return (
                    <div
                        key={plan.specification.specification_id}
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                            isCurrentPlan ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50"
                        }`}
                    >
                      <RadioGroupItem
                          value={plan.specification.specification_id}
                          id={plan.specification.specification_id}
                          disabled={isCurrentPlan}
                      />
                      <Label htmlFor={plan.specification.specification_id} className="flex-grow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{plan.specification.title}</span>
                              {isCurrentPlan && (
                                  <Badge variant="secondary" className="text-xs">
                                    Current Plan
                                  </Badge>
                              )}
                              {isDowngrade && !isCurrentPlan && (
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
                onClick={handleSave}
                disabled={
                    isSubmitting ||
                    !selectedSpecification ||
                    plans.find(plan => plan.specification.specification_id === selectedSpecification)?.specification.title === server?.specification_title
                }
            >
              {isSubmitting ? "Upgrading..." : "Confirm Upgrade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}