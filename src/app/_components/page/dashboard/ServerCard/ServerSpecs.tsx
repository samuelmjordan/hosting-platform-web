import {HardDrive, MemoryStick} from "lucide-react"
import { Server } from "@/app/types"

interface ServerSpecsProps {
    server: Server
}

export function ServerSpecs({ server }: ServerSpecsProps) {
    return (
        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{server.ram_gb} GB</span>
                </div>
                <p className="text-xs text-muted-foreground">Memory</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{server.ssd_gb} GB</span>
                </div>
                <p className="text-xs text-muted-foreground">SSD</p>
            </div>
        </div>
    )
}