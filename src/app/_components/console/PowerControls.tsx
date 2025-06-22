import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Square, RotateCcw, X, Zap } from "lucide-react";
import { PowerSignal } from "@/app/_components/console/utils/types";

interface PowerControlsProps {
    isConnected: boolean;
    onPowerSignal: (signal: PowerSignal) => void;
}

export function PowerControls({ isConnected, onPowerSignal }: PowerControlsProps) {
    const controls = [
        {
            signal: 'start' as PowerSignal,
            label: 'start',
            icon: Play,
            variant: 'default' as const,
            className: 'bg-emerald-600/20 hover:bg-emerald-600 border-emerald-500/30 text-emerald-400 hover:text-white'
        },
        {
            signal: 'stop' as PowerSignal,
            label: 'stop',
            icon: Square,
            variant: 'secondary' as const,
            className: 'bg-amber-600/20 hover:bg-amber-600 border-amber-500/30 text-amber-400 hover:text-white'
        },
        {
            signal: 'restart' as PowerSignal,
            label: 'restart',
            icon: RotateCcw,
            variant: 'outline' as const,
            className: 'bg-blue-600/20 hover:bg-blue-600 border-blue-500/30 text-blue-400 hover:text-white'
        },
        {
            signal: 'kill' as PowerSignal,
            label: 'kill',
            icon: X,
            variant: 'destructive' as const,
            className: 'bg-red-600/20 hover:bg-red-600 border-red-500/30 text-red-400 hover:text-white'
        }
    ];

    return (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-400" />
                    power controls
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {controls.map(({ signal, label, icon: Icon, className }) => (
                        <Button
                            key={signal}
                            onClick={() => onPowerSignal(signal)}
                            disabled={!isConnected}
                            className={className}
                            variant="outline"
                            size="sm"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Icon className="h-4 w-4" />
                                {label}
                            </div>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}