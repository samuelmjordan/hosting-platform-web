import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, MemoryStick, HardDrive, Network } from "lucide-react";
import { ServerStats } from "@/app/_components/console/utils/types";
import { formatBytes } from "@/app/_components/console/utils/utils";

interface ResourceStatsProps {
    stats: ServerStats;
}

export function ResourceStats({ stats }: ResourceStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* CPU */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-400" />
                        cpu load
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-400 font-bold">{stats.cpu_absolute.toFixed(1)}%</span>
                        </div>
                        <Progress
                            value={Math.min(stats.cpu_absolute, 100)}
                            className="h-2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Memory */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MemoryStick className="h-4 w-4 text-emerald-400" />
                        memory
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
              <span className="text-emerald-400 font-bold text-xs">
                {formatBytes(stats.memory_bytes)}
              </span>
                        </div>
                        <Progress
                            value={(stats.memory_bytes / stats.memory_limit_bytes) * 100}
                            className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                            of {formatBytes(stats.memory_limit_bytes)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Disk */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-amber-400" />
                        disk usage
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-amber-400 font-bold text-xs">{formatBytes(stats.disk_bytes)}</span>
                        </div>
                        <Progress
                            value={35} // you'll need to add disk limit to stats
                            className="h-2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Network */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Network className="h-4 w-4 text-purple-400" />
                        network
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">↓ download</span>
                            <span className="text-purple-400 font-bold">{formatBytes(stats.network.rx_bytes)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">↑ upload</span>
                            <span className="text-pink-400 font-bold">{formatBytes(stats.network.tx_bytes)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}