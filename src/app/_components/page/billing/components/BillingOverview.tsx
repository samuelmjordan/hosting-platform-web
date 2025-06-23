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
      <Card className="mb-8 overflow-hidden border-0 shadow-md dark:shadow-2xl">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardContent className="pt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* total monthly billing */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  total monthly billing
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {formatCurrency({ type: currency, value: totalAmount })}
                </p>
              </div>

              {/* active subscriptions */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  active subscriptions
                </p>
                <p className="text-3xl font-bold text-foreground">{activeCount}</p>
              </div>

              {/* next payment */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  next payment
                </p>
                <p className="text-3xl font-bold text-foreground">
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