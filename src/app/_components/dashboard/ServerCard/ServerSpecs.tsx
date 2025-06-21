import {Cpu, HardDrive, MemoryStick} from "lucide-react"
import { Server } from "@/app/types"

interface ServerSpecsProps {
  server: Server
}

export function ServerSpecs({ server }: ServerSpecsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Cpu className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">{server.vcpu}</span>
            </div>
            <p className="text-xs text-slate-600">CPU Cores</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MemoryStick className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">{server.ram_gb} GB</span>
            </div>
            <p className="text-xs text-slate-600">Memory</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
                <HardDrive className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">{server.ssd_gb} GB</span>
            </div>
            <p className="text-xs text-slate-600">SSD</p>
        </div>
    </div>
  )
}