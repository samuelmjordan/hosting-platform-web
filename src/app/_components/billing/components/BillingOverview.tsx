import { Card, CardContent } from "@/components/ui/card"
import type { Server } from "@/app/types"
import { formatCurrency, formatDate } from "../utils/formatters"
import { getCurrency, sumAmount, getNextPaymentDate, getActiveServersCount } from "../utils/billing-helpers"

interface BillingOverviewProps {
  servers: Server[]
}

export function BillingOverview({ servers }: BillingOverviewProps) {
  const currency = getCurrency(servers)
  const totalAmount = sumAmount(servers)
  const activeCount = getActiveServersCount(servers)
  const nextServer = getNextPaymentDate(servers)
  
  return (
    <Card className="mb-8 overflow-hidden border-0 shadow-md">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardContent className="pt-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Monthly Billing */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Monthly Billing
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency({ type: currency, value: totalAmount })}
              </p>
            </div>
            
            {/* Active Subscriptions */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Active Subscriptions
              </p>
              <p className="text-3xl font-bold">{activeCount}</p>
            </div>
            
            {/* Next Payment */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Next Payment
              </p>
              <p className="text-3xl font-bold">
                {formatDate(nextServer?.current_period_end ?? 0)}
              </p>
              {nextServer && (
                <p className="text-xs text-muted-foreground mt-1">
                  {nextServer.server_name}: {formatCurrency({
                    type: nextServer.currency,
                    value: nextServer.minor_amount,
                  })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}