import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, WifiOff, Clock } from "lucide-react";
import { getStatusBadgeVariant } from "@/app/_components/console/utils/utils";

interface ConnectionStatusProps {
    isConnected: boolean;
    serverStatus: string;
    uptime: string;
    onConnect: () => void;
    onDisconnect: () => void;
    isAuthenticated: boolean;
}

export function ConnectionStatus({
     isConnected,
     serverStatus,
     uptime,
     onConnect,
     onDisconnect,
     isAuthenticated
}: ConnectionStatusProps) {
    return (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {isConnected ? (
                                <Wifi className="h-5 w-5 text-emerald-400" />
                            ) : (
                                <WifiOff className="h-5 w-5 text-red-400" />
                            )}
                            {isConnected && (
                                <div className="absolute inset-0 w-5 h-5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-white">server console</CardTitle>
                            <div className="flex items-center gap-3 mt-1 text-sm">
                                <Badge variant={getStatusBadgeVariant(serverStatus)}>
                                    {serverStatus.toUpperCase()}
                                </Badge>
                                <div className="flex items-center gap-1 text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    <span>uptime: {uptime}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={onConnect}
                            disabled={isConnected || !isAuthenticated}
                            variant="default"
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            connect
                        </Button>
                        <Button
                            onClick={onDisconnect}
                            disabled={!isConnected}
                            variant="destructive"
                        >
                            disconnect
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}