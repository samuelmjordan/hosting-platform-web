import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowUpRight, MapPin, TrendingUp, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Plan, Server } from "@/app/types"
import Link from "next/link"
import {BILLING_PATH} from "@/app/constants";

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
          size="sm"
          className="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
          onClick={hasUpgrades ? onUpgrade : undefined}
          disabled={!hasUpgrades}
      >
        <TrendingUp className="h-3 w-3 mr-1" />
        Upgrade
      </Button>
  )

  return (
      <TooltipProvider>
        <div className="px-6 py-4 bg-muted/30 border-t border-border mt-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Link href={`/panel/${server.subscription_id}/console`}>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Manage
                </Button>
              </Link>
              <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => router.push(BILLING_PATH + "?tab=subscription")}
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Billing
              </Button>
            </div>
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
            </div>
          </div>
        </div>
      </TooltipProvider>
  )
}