import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Server } from "@/app/types"
import { FIXED_DOMAIN, MAX_SUBDOMAIN_LENGTH, MAX_TITLE_LENGTH } from "../utils/constants"
import { validateSubdomain } from "../utils/formatters"

interface EditServerDialogProps {
  server: Server | null
  isOpen: boolean
  onClose: () => void
  onSave: (serverId: string, name: string, address: string) => Promise<void>
}

export function EditServerDialog({ server, isOpen, onClose, onSave }: EditServerDialogProps) {
  const [serverName, setServerName] = useState("")
  const [serverAddress, setServerAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (server) {
      setServerName(server.server_name)
      if (server.cname_record_name) {
        const subdomain = server.cname_record_name.replace(FIXED_DOMAIN, "")
        setServerAddress(subdomain)
      } else {
        setServerAddress("")
      }
    }
  }, [server])

  const isFormValid = () => {
    if (!server || !serverName.trim()) return false
    if (serverName.trim().length > MAX_TITLE_LENGTH) return false
    if (serverAddress.trim() && !validateSubdomain(serverAddress.trim())) return false

    const nameChanged = serverName.trim() !== server.server_name
    const addressChanged =
        serverAddress.trim().toLowerCase() !== (server.cname_record_name?.replace(FIXED_DOMAIN, "") || "")

    return nameChanged || addressChanged
  }

  const handleSave = async () => {
    if (!server || !isFormValid()) return

    setIsSubmitting(true)
    try {
      await onSave(server.subscription_id, serverName.trim(), serverAddress.trim().toLowerCase())
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Server Details</DialogTitle>
            <DialogDescription>Update your server name and address.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="server-name">
                Server Name{" "}
                <span className="text-xs text-muted-foreground">
                ({serverName.length}/{MAX_TITLE_LENGTH})
              </span>
              </Label>
              <Input
                  id="server-name"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="Enter server name"
                  maxLength={MAX_TITLE_LENGTH}
                  autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-address">
                Server Address{" "}
                <span className="text-xs text-muted-foreground">
                ({serverAddress.length}/{MAX_SUBDOMAIN_LENGTH})
              </span>
              </Label>
              <div className="flex items-center overflow-hidden">
                <Input
                    id="server-address"
                    value={serverAddress}
                    onChange={(e) => setServerAddress(e.target.value.toLowerCase())}
                    placeholder="subdomain"
                    maxLength={MAX_SUBDOMAIN_LENGTH}
                    className="rounded-r-none flex-shrink min-w-0"
                />
                <div className="bg-muted border border-l-0 border-input px-3 py-2 text-sm text-muted-foreground rounded-r-md whitespace-nowrap overflow-hidden">
                  {FIXED_DOMAIN}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to remove address. Use only letters, numbers, and hyphens.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
                onClick={handleSave}
                disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}