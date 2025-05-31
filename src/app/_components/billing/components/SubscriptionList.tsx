import { Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Server } from "@/app/types"
import { SubscriptionCard } from "./SubscriptionCard"

interface SubscriptionListProps {
  servers: Server[]
  onCancelClick: (server: Server) => void
  onUncancelClick: (server: Server) => void
  loadingSubscriptions?: Set<string>
}

export function SubscriptionList({ servers, onCancelClick, onUncancelClick, loadingSubscriptions }: SubscriptionListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Subscriptions</h2>
        <Link href="/store">
          <Button className="shadow-sm transition-all hover:shadow">
            <Package className="mr-2 h-4 w-4" />
            Add New Subscription
          </Button>
        </Link>
      </div>
      
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
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg">
      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No active subscriptions</h3>
      <p className="text-sm text-gray-500 mb-6">
        Get started by adding your first server subscription
      </p>
      <Link href="/store">
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Browse Available Plans
        </Button>
      </Link>
    </div>
  )
}