import { CalendarIcon, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Server } from "@/app/types"
import { formatCurrency, formatDate } from "../utils/formatters"
import { SUBSCRIPTION_STATUS, PLAN_STYLES, REGIONS } from "../utils/constants"

interface SubscriptionCardProps {
  server: Server
  onCancelClick: (server: Server) => void
}

export function SubscriptionCard({ server, onCancelClick }: SubscriptionCardProps) {
  const status = SUBSCRIPTION_STATUS[server.subscription_status as keyof typeof SUBSCRIPTION_STATUS] || SUBSCRIPTION_STATUS.active
  const planStyle = PLAN_STYLES[server.specification_title as keyof typeof PLAN_STYLES] || PLAN_STYLES.default
  const region = REGIONS[server.region_code as keyof typeof REGIONS] || REGIONS.default
  
  const StatusIcon = status.icon
  
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow transition-all">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <CardTitle className="text-xl mb-2">{server.server_name}</CardTitle>
            <div className="flex flex-wrap gap-2">
              {/* Status Badge */}
              <Badge
                variant="outline"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${status.className}`}
              >
                <StatusIcon className="h-4 w-4" />
                {status.label}
              </Badge>
              
              {/* Region Badge */}
              <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 rounded-md">
                <span className="text-base leading-none">{region.flag}</span>
                {region.label}
              </Badge>
              
              {/* Plan Badge */}
              <Badge
                variant="outline"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${planStyle}`}
              >
                {server.specification_title}
              </Badge>
            </div>
          </div>
          
          {/* Pricing */}
          <div className="text-right">
            <p className="text-2xl font-bold">
              {formatCurrency({ type: server.currency, value: server.minor_amount })}
            </p>
            <p className="text-muted-foreground text-sm">per month</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-4">
          {server.cname_record_name && (
            <p className="text-sm text-muted-foreground">{server.cname_record_name}</p>
          )}
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <DetailRow label="Subscription ID" value={server.subscription_id} />
              <DetailRow label="Billing cycle" value="Monthly" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Auto-Renew</span>
                <div className="flex items-center">
                  {!server.cancel_at_period_end ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />
                      <span className="text-sm font-medium">On</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
                      <span className="text-sm font-medium text-destructive">Off</span>
                    </>
                  )}
                </div>
              </div>
              
              {server.cancel_at_period_end ? (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cancels at</span>
                  <span className="text-sm font-medium flex items-center text-destructive">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {formatDate(server.current_period_end)}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Next billing date</span>
                  <span className="text-sm font-medium flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {formatDate(server.current_period_end)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      {!server.cancel_at_period_end && server.subscription_status === "active" && (
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            className="shadow-sm hover:shadow transition-all"
            onClick={() => onCancelClick(server)}
          >
            Cancel Subscription
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Little helper component for the detail rows
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}