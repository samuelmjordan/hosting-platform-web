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

    // call the onConfirm callback if provided
    if (onConfirm) {
      onConfirm(server)
    }

    // close dialog (toast is handled by the hook)
    onOpenChange(false)
  }

  if (!server) return null

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              cancel your {server.server_name} subscription?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              your subscription will remain active until the end of your current billing period on{" "}
              {formatDate(server.current_period_end)}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border hover:bg-accent"
            >
              keep subscription
            </Button>
            <Button
                variant="destructive"
                onClick={handleCancel}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              cancel subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}