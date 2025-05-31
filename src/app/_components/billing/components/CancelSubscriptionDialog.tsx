import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import type { Server } from "@/app/types"
import { formatDate } from "../utils/formatters"

interface CancelSubscriptionDialogProps {
  server: Server | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (server: Server) => void
}

export function CancelSubscriptionDialog({
  server,
  open,
  onOpenChange,
  onConfirm
}: CancelSubscriptionDialogProps) {
  
  const handleCancel = () => {
    if (!server) return
    
    // Call the onConfirm callback if provided
    if (onConfirm) {
      onConfirm(server)
    }
    
    // Show success toast
    toast({
      title: "Subscription canceled",
      description: `Your ${server.server_name} subscription has been canceled and will end at the billing period.`,
    })
    
    // Close dialog
    onOpenChange(false)
  }
  
  if (!server) return null
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel your {server.server_name} subscription?</DialogTitle>
          <DialogDescription>
            Your subscription will remain active until the end of your current billing period on{" "}
            {formatDate(server.current_period_end)}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Subscription
          </Button>
          <Button variant="destructive" onClick={handleCancel}>
            Cancel Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}