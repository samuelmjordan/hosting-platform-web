import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function CreateServerCard() {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 flex flex-col h-full">
      <div className="p-6 pb-4 flex-grow flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg mb-4">
          <Plus className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Create New Server</h3>
        <p className="text-slate-600 mb-6 max-w-sm">
          Deploy a new Minecraft server in minutes. Choose from our optimized plans and get started instantly.
        </p>
      </div>

      <div className="px-6 py-4 bg-pink-100/50 border-t border-pink-200 mt-auto">
        <div className="flex justify-center">
          <Link href="/store">
            <Button
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
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