import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowUpRight, MapPin, TrendingUp, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Plan, Server } from "@/app/types"
import Link from "next/link"

interface ActionFooterProps {
  plans: Plan[]
  server: Server
  onUpgrade: () => void
}

export function ActionFooter({ plans, server, onUpgrade }: ActionFooterProps) {
  const router = useRouter()
  const planUpgrades: Plan[] = server 
    ? plans.filter((plan) => 
      plan.price.currency === server.currency
      && plan.price.minor_amount > server.minor_amount)
    : []

  const hasUpgrades = planUpgrades.length > 0

  const upgradeButton = (
    <Button
      variant="outline"
      size="sm"
      className="bg-white text-xs"
      onClick={hasUpgrades ? onUpgrade : undefined}
      disabled={!hasUpgrades}
    >
      <TrendingUp className="h-3 w-3 mr-1" />
      Upgrade
    </Button>
  )

  return (
    <TooltipProvider>
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 mt-auto">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {hasUpgrades ? upgradeButton : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    {upgradeButton}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>No upgrades available</p>
                </TooltipContent>
              </Tooltip>
            )}
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
          <Link href={`/${server.subscription_id}/console`}>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Manage
            </Button>
          </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}