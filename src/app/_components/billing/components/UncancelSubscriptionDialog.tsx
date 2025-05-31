import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Server } from "@/app/types"
import { formatDate } from "../utils/formatters"

interface UncancelSubscriptionDialogProps {
  server: Server | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (server: Server) => void
}

export function UncancelSubscriptionDialog({
  server,
  open,
  onOpenChange,
  onConfirm
}: UncancelSubscriptionDialogProps) {
  
  const handleUncancel = () => {
    if (!server) return
    
    // Call the onConfirm callback if provided
    if (onConfirm) {
      onConfirm(server)
    }
    
    // Close dialog
    onOpenChange(false)
  }
  
  if (!server) return null
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resume your {server.server_name} subscription?</DialogTitle>
          <DialogDescription>
            Your subscription will renew at the end of your current billing period on{" "}
            {formatDate(server.current_period_end)}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleUncancel}>
            Resume Subscription
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Stay Canceled
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}