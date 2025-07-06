import { CalendarIcon, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Server } from "@/app/types"
import { formatCurrency, formatDate } from "../utils/formatters"
import PlanTierBadge from "@/app/_components/common/PlanTierBadge";
import {StatusBadge} from "@/app/_components/common/StatusBadge";
import {RegionBadge} from "@/app/_components/common/RegionBadge";
import React from "react";

interface SubscriptionCardProps {
  server: Server
  onCancelClick: (server: Server) => void
  onUncancelClick: (server: Server) => void
  isLoading?: boolean
}

export function SubscriptionCard({ server, onCancelClick, onUncancelClick, isLoading = false }: SubscriptionCardProps) {
  return (
      <Card className="overflow-hidden shadow-sm hover:shadow dark:shadow-xl dark:hover:shadow-2xl transition-all">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <CardTitle className="text-xl mb-2 text-foreground">{server.server_name}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {/* region badge */}
                <RegionBadge region="Europe" />

                {/* plan badge */}
                <PlanTierBadge specificationTitle={`${server.specification_title}`} />

                {/* status badge */}
                <StatusBadge status={server.subscription_status} />
              </div>
            </div>

            {/* pricing */}
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
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

            <Separator className="bg-border" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <DetailRow label="Subscription id" value={server.subscription_id} />
                <DetailRow label="Billing cycle" value="monthly" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Auto-renew</span>
                  <div className="flex items-center">
                    {!server.cancel_at_period_end ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400" />
                          <span className="text-sm font-medium text-foreground">On</span>
                        </>
                    ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1.5 text-red-500 dark:text-red-400" />
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
                      <span className="text-sm font-medium flex items-center text-foreground">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                        {formatDate(server.current_period_end)}
                  </span>
                    </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        {server.cancel_at_period_end && server.subscription_status === "active" ? (
            <CardFooter className="pt-2">
              <Button
                  variant="outline"
                  className="shadow-sm hover:shadow dark:shadow-md dark:hover:shadow-lg transition-all border-border hover:bg-accent"
                  onClick={() => onUncancelClick(server)}
                  disabled={isLoading}
              >
                {isLoading ? "Resuming..." : "Resume subscription"}
              </Button>
            </CardFooter>
        ) : (
            !server.cancel_at_period_end && server.subscription_status === "active" && (
                <CardFooter className="pt-2">
                  <Button
                      variant="outline"
                      className="shadow-sm hover:shadow dark:shadow-md dark:hover:shadow-lg transition-all border-border hover:bg-accent"
                      onClick={() => onCancelClick(server)}
                      disabled={isLoading}
                  >
                    {isLoading ? "Canceling..." : "Cancel subscription"}
                  </Button>
                </CardFooter>
            )
        )}
      </Card>
  )
}

// little helper component for the detail rows
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
  )
}