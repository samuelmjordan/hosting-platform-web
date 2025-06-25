import { Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Server } from "@/app/types"
import { SubscriptionCard } from "./SubscriptionCard"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

interface SubscriptionListProps {
    servers: Server[]
    onCancelClick: (server: Server) => void
    onUncancelClick: (server: Server) => void
    loadingSubscriptions?: Set<string>
}

export function SubscriptionList({ servers, onCancelClick, onUncancelClick, loadingSubscriptions }: SubscriptionListProps) {
    return (
        <div className="space-y-6">
            <Card className="shadow-sm dark:shadow-xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-foreground">Your subscription</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                View and manage your server subscriptions
                            </CardDescription>
                        </div>
                        <Link href="/store">
                            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50">
                                <Package className="mr-2 h-4 w-4" />
                                Add new subscription
                            </Button>
                        </Link>
                    </div>
                </CardHeader>

                <CardContent>
                {servers.length === 0 ? (
                    <EmptyState />
                ) : (
                    servers.map((server) => (
                        <SubscriptionCard
                            key={server.subscription_id}
                            server={server}
                            onCancelClick={onCancelClick}
                            onUncancelClick={onUncancelClick}
                            isLoading={loadingSubscriptions?.has(server.subscription_id)}
                        />
                    ))
                )}
                </CardContent>
            </Card>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-lg">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No active subscriptions</h3>
            <p className="text-sm text-muted-foreground mb-6">
                Get started by adding your first server subscription
            </p>
            <Link href="/store">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Package className="mr-2 h-4 w-4" />
                    Browse available plans
                </Button>
            </Link>
        </div>
    )
}