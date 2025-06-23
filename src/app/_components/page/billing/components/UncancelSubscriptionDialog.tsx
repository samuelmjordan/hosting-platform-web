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

    // call the onConfirm callback if provided
    if (onConfirm) {
      onConfirm(server)
    }

    // close dialog
    onOpenChange(false)
  }

  if (!server) return null

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              resume your {server.server_name} subscription?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              your subscription will renew at the end of your current billing period on{" "}
              {formatDate(server.current_period_end)}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
                onClick={handleUncancel}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              resume subscription
            </Button>
            <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="hover:bg-accent"
            >
              stay canceled
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}