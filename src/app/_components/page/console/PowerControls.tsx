import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Square, RotateCcw, X, Zap } from "lucide-react";
import { PowerSignal } from "@/app/_components/page/console/utils/types";

interface PowerControlsProps {
    isConnected: boolean;
    onPowerSignal: (signal: PowerSignal) => void;
}

export function PowerControls({ isConnected, onPowerSignal }: PowerControlsProps) {
    const controls = [
        {
            signal: 'start' as PowerSignal,
            label: 'Start',
            icon: Play,
            variant: 'default' as const,
            className: 'bg-emerald-100 hover:bg-emerald-600 border-emerald-300 text-emerald-700 hover:text-white dark:bg-emerald-600/20 dark:hover:bg-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:text-white'
        },
        {
            signal: 'stop' as PowerSignal,
            label: 'Stop',
            icon: Square,
            variant: 'secondary' as const,
            className: 'bg-amber-100 hover:bg-amber-600 border-amber-300 text-amber-700 hover:text-white dark:bg-amber-600/20 dark:hover:bg-amber-600 dark:border-amber-500/30 dark:text-amber-400 dark:hover:text-white'
        },
        {
            signal: 'restart' as PowerSignal,
            label: 'Restart',
            icon: RotateCcw,
            variant: 'outline' as const,
            className: 'bg-blue-100 hover:bg-blue-600 border-blue-300 text-blue-700 hover:text-white dark:bg-blue-600/20 dark:hover:bg-blue-600 dark:border-blue-500/30 dark:text-blue-400 dark:hover:text-white'
        },
        {
            signal: 'kill' as PowerSignal,
            label: 'Kill',
            icon: X,
            variant: 'destructive' as const,
            className: 'bg-red-100 hover:bg-red-600 border-red-300 text-red-700 hover:text-white dark:bg-red-600/20 dark:hover:bg-red-600 dark:border-red-500/30 dark:text-red-400 dark:hover:text-white'
        }
    ];

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-400" />
                    Power controls
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