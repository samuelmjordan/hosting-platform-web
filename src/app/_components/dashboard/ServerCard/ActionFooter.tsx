import { Button } from "@/components/ui/button"
import { ArrowUpRight, MapPin, TrendingUp, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Plan, Server } from "@/app/types"

interface ActionFooterProps {
  servers: Server[]
  server: Server
  onChangeRegion: () => void
  onUpgrade: () => void
}

export function ActionFooter({ servers, server, onChangeRegion, onUpgrade }: ActionFooterProps) {
  const router = useRouter()
  const serverUpgrades: Server[] = server 
    ? servers.filter((otherServer) => 
      otherServer.currency === server.currency
      && otherServer.minor_amount > server.minor_amount)
    : []

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
          {(serverUpgrades.length > 0) 
          ? (<Button
            variant="outline"
            size="sm"
            className="bg-white text-xs"
            onClick={onUpgrade}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Upgrade
          </Button>)
          : (<Button
            variant="outline"
            size="sm"
            className="bg-white text-xs"
            disabled
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Upgrade
          </Button>)}
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