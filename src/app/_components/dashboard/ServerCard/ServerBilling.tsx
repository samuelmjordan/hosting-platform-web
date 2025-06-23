import { Badge } from "@/components/ui/badge"
import { CreditCard, CheckCircle2, XCircle, CalendarIcon } from "lucide-react"
import { Server } from "@/app/types"
import { formatCurrency, formatDate } from "../utils/formatters"

interface ServerBillingProps {
    server: Server
}

export function ServerBilling({ server }: ServerBillingProps) {
    return (
        <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
            {formatCurrency({ type: server.currency, value: server.minor_amount })}
          </span>
                    <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <Badge
                    variant={server.subscription_status === "active" ? "default" : "destructive"}
                    className={`text-xs ${
                        server.subscription_status === "active"
                            ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
                            : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700"
                    }`}
                >
                    {server.subscription_status === "active" ? (
                        <>
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                            active
                        </>
                    ) : (
                        <>
                            <XCircle className="h-3 w-3 mr-1 text-red-600 dark:text-red-400" />
                            inactive
                        </>
                    )}
                </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>auto-renew</span>
                <div className="flex items-center">
                    {!server.cancel_at_period_end ? (
                        <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">on</span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <XCircle className="mr-1 h-4 w-4 text-red-500" />
                            <span className="text-red-600 dark:text-red-400 text-sm font-medium">off</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>period ends</span>
                <div className="flex items-center gap-1">
                    {!server.cancel_at_period_end ? (
                        <span className="text-sm font-medium">{formatDate(server.current_period_end)}</span>
                    ) : (
                        <span className="text-sm font-medium flex items-center text-destructive">
              <CalendarIcon className="mr-1 h-4 w-4" />
                            {formatDate(server.current_period_end)}
            </span>
                    )}
                </div>
            </div>
        </div>
    )
}