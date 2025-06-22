import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal, Send, AlertCircle } from "lucide-react";
import { parseAnsiString } from "@/app/_components/console/utils/ansiParser";

interface ConsoleOutputProps {
    logs: string[];
    error: string | null;
    isConnected: boolean;
    onSendCommand: (command: string) => void;
}

export function ConsoleOutput({ logs, error, isConnected, onSendCommand }: ConsoleOutputProps) {
    const [command, setCommand] = useState("");
    const logsEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    const handleSendCommand = () => {
        if (command.trim()) {
            onSendCommand(command);
            setCommand("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendCommand();
        }
    };

    const renderLogLine = (log: string, index: number) => {
        const spans = parseAnsiString(log);

        return (
            <div key={index} className="hover:bg-accent/5 px-2 py-0.5 rounded transition-colors">
                {spans.map((span, spanIndex) => (
                    <span key={spanIndex} className={span.className}>
            {span.text}
          </span>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        error: {error}
                    </AlertDescription>
                </Alert>
            )}

            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-2xl">
                <CardHeader className="bg-muted/50 border-b border-border">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-green-400" />
                        console output
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="h-96 overflow-y-auto p-4 bg-black font-mono text-sm leading-relaxed">
                        {logs.length === 0 ? (
                            <div className="text-muted-foreground italic">no console output yet. connect to start receiving logs...</div>
                        ) : (
                            logs.map((log, i) => renderLogLine(log, i))
                        )}
                        <div ref={logsEndRef} />
                    </div>

                    <div className="border-t border-border bg-muted/50 p-4">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="type a command..."
                                disabled={!isConnected}
                                className="flex-1 bg-background/50 border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring font-mono"
                            />
                            <Button
                                onClick={handleSendCommand}
                                disabled={!isConnected || !command.trim()}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                send
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}