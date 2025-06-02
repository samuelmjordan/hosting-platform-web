import { Button } from "@/components/ui/button"
import { ArrowUpRight, MapPin, TrendingUp, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Server } from "@/app/types"

interface ActionFooterProps {
  server: Server
  onChangeRegion: () => void
  onUpgrade: () => void
}

export function ActionFooter({ server, onChangeRegion, onUpgrade }: ActionFooterProps) {
  const router = useRouter()

  return (
    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-xs"
            onClick={onChangeRegion}
          >
            <MapPin className="h-3 w-3 mr-1" />
            Region
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-xs"
            onClick={onUpgrade}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-xs"
            onClick={() => router.push("/billing?tab=subscription")}
          >
            <DollarSign className="h-3 w-3 mr-1" />
            Billing
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Manage
          </Button>
        </div>
      </div>
    </div>
  )
}