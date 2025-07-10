import { Card } from "@/components/ui/card"
import { Plan, Server } from "@/app/types"
import { ServerStatus } from "../hooks/useServerStatus"
import { ServerHeader } from "./ServerHeader"
import { ServerStatusDisplay } from "./ServerStatusDisplay"
import { ServerSpecs } from "./ServerSpecs"
import { ServerBilling } from "./ServerBilling"
import { ActionFooter } from "./ActionFooter"

interface ServerCardProps {
  plans: Plan[]
  server: Server
  status: ServerStatus
  copiedId: string | null
  onCopy: (text: string, id: string) => void
  onEdit: (server: Server) => void
  onUpgrade: (server: Server) => void
}

export function ServerCard({
   plans,
   server,
   status,
   copiedId,
   onCopy,
   onEdit,
   onUpgrade,
}: ServerCardProps) {

  return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border flex flex-col h-full">
        <div className="p-6 pb-4 flex-grow flex flex-col">
          <div className="flex-grow">
            <ServerHeader
                server={server}
                status={status}
                onEdit={() => onEdit(server)}
            />

            <ServerStatusDisplay
                server={server}
                status={status}
                isOnline={status.minecraftStatus.minecraftOnline}
                statusReady={!status.isChecking}
                copiedId={copiedId}
                onCopy={onCopy}
            />
          </div>

          <div className="mt-auto">
            <ServerSpecs server={server} />
            <ServerBilling server={server} />
          </div>
        </div>

        <ActionFooter
            plans={plans}
            server={server}
            onUpgrade={() => onUpgrade(server)}
        />
      </Card>
  )
}