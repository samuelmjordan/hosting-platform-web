import { Badge } from "@/components/ui/badge"
import { CreditCard, CheckCircle2, XCircle, CalendarIcon } from "lucide-react"
import { Server } from "@/app/types"
import { formatCurrency, formatDate } from "../utils/formatters"

interface ServerBillingProps {
  server: Server
}

export function ServerBilling({ server }: ServerBillingProps) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-900">
            {formatCurrency({ type: server.currency, value: server.minor_amount })}
          </span>
          <span className="text-xs text-slate-600">/month</span>
        </div>
        <Badge
          className={`text-xs ${
            server.subscription_status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {server.subscription_status === "active" ? "Active" : "Inactive"}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Auto-Renew</span>
        <div className="flex items-center">
          {!server.cancel_at_period_end ? (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span className="text-green-600">On</span>
            </div>
          ) : (
            <div className="flex items-center">
              <XCircle className="mr-1 h-4 w-4 text-red-500" />
              <span className="text-red-600 text-sm font-medium">Off</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Period ends</span>
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