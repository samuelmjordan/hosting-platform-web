import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function CreateServerCard() {
  return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border flex flex-col h-full group">
        <div className="p-6 pb-4 flex-grow flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm mb-4 group-hover:bg-primary/15 transition-colors">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Create New Server</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Deploy a new Minecraft server in minutes. Choose from our optimized plans and get started instantly.
          </p>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-t border-border mt-auto">
          <div className="flex justify-center">
            <Link href="/store">
              <Button
                  size="sm"
                  className="text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Server
              </Button>
            </Link>
          </div>
        </div>
      </Card>
  )
}