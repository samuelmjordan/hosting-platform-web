import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function CreateServerCard() {
  return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card ring-2 ring-accent flex flex-col h-full group">
        <div className="p-6 pb-4 flex-grow flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-xl bg-accent /10 ring-2 ring-accent flex items-center justify-center shadow-sm mb-4 group-hover:bg-accent/80 transition-colors">
            <Plus className="h-8 w-8 text-accent-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">create new server</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            deploy a new minecraft server in minutes
          </p>
        </div>

        <div className="px-6 py-4 bg-muted/30 ring-2 ring-accent mt-auto">
          <div className="flex justify-center">
            <Link href="/store">
              <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
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