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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Server, Region } from "@/app/types"
import { getRegionFlag } from "../utils/formatters"

interface ChangeRegionDialogProps {
  server: Server | null
  regions: Region[]
  isOpen: boolean
  onClose: () => void
  onSave: (serverId: string, regionCode: string) => Promise<void>
}

export function ChangeRegionDialog({ server, regions, isOpen, onClose, onSave }: ChangeRegionDialogProps) {
  const [selectedRegion, setSelectedRegion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (server) {
      setSelectedRegion(server.region_code)
    }
  }, [server])

  const handleSave = async () => {
    if (!server || !selectedRegion || selectedRegion === server.region_code) return

    setIsSubmitting(true)
    try {
      await onSave(server.subscription_id, selectedRegion)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Server Region</DialogTitle>
          <DialogDescription>
            Select a new region for your server. This will migrate your server data to the new location.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedRegion} onValueChange={setSelectedRegion}>
            {regions.map((region) => (
              <div key={region.region_id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-50">
                <RadioGroupItem value={region.region_code} id={region.region_id} />
                <Label htmlFor={region.region_id} className="flex items-center gap-2 cursor-pointer flex-grow">
                  <span className="text-lg">{getRegionFlag(region.region_code)}</span>
                  <div>
                    <span className="font-medium">{region.city}</span>
                    <span className="text-sm text-slate-500 ml-2">{region.continent}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting || selectedRegion === server?.region_code}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {isSubmitting ? "Changing..." : "Change Region"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}