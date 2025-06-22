import { useState, useRef, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {PowerSignal, ServerStats, ServerStatus} from "@/app/_components/console/utils/types";

export function useWebSocket(subscriptionUid: string) {
    const [isConnected, setIsConnected] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [serverStatus, setServerStatus] = useState<ServerStatus>("offline");
    const [stats, setStats] = useState<ServerStats | null>(null);
    const [uptime, setUptime] = useState<string>("0h 0m 0s");

    const wsRef = useRef<WebSocket | null>(null);
    const uptimeStartRef = useRef<Date | null>(null);
    const { user } = useUser();

    const connect = useCallback(async () => {
        try {
            setError(null);

            if (!user?.id) {
                setError("user not authenticated");
                return;
            }

            const wsUrl = process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:8080';
            const ws = new WebSocket(`${wsUrl}/ws/user/${user.id}/subscription/${subscriptionUid}`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("connected to spring proxy");
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.event === "auth success") {
                        console.log("authenticated with pterodactyl");
                        ws.send(JSON.stringify({
                            event: "send logs",
                            args: [null]
                        }));
                    } else if (data.event === "console output") {
                        setLogs(prev => [...prev, data.args[0]]);
                    } else if (data.event === "status") {
                        const newStatus = data.args[0];
                        setServerStatus(newStatus);
                        if (newStatus === "running" && !uptimeStartRef.current) {
                            uptimeStartRef.current = new Date();
                        } else if (newStatus === "offline") {
                            uptimeStartRef.current = null;
                            setUptime("0h 0m 0s");
                        }
                    } else if (data.event === "stats") {
                        try {
                            const statsData = JSON.parse(data.args[0]);
                            setStats(statsData);
                        } catch (e) {
                            console.error("failed to parse stats:", e);
                        }
                    } else if (data.event === "token expiring") {
                        console.log("token expiring - backend will handle refresh");
                    } else if (data.event === "token expired") {
                        setError("authentication expired");
                    }
                } catch (e) {
                    setLogs(prev => [...prev, event.data]);
                }
            };

            ws.onclose = (event) => {
                setIsConnected(false);
                if (event.code !== 1000) {
                    setError(`connection closed: ${event.reason || 'unknown reason'}`);
                }
            };

            ws.onerror = (error) => {
                setError("websocket error occurred");
                console.error("ws error:", error);
            };

        } catch (err) {
            setError(err instanceof Error ? err.message : "failed to connect");
        }
    }, [user?.id, subscriptionUid]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close(1000, "user requested disconnect");
            wsRef.current = null;
        }
        setIsConnected(false);
        setLogs([]);
        setError(null);
        setStats(null);
        setServerStatus("offline");
        uptimeStartRef.current = null;
        setUptime("0h 0m 0s");
    }, []);

    const sendCommand = useCallback((command: string) => {
        if (wsRef.current && isConnected && command.trim()) {
            wsRef.current.send(JSON.stringify({
                event: "send command",
                args: [command.trim()]
            }));

            setLogs(prev => [...prev, `> ${command.trim()}`]);
        }
    }, [isConnected]);

    const sendPowerSignal = useCallback((signal: PowerSignal) => {
        if (wsRef.current && isConnected) {
            wsRef.current.send(JSON.stringify({
                event: "set state",
                args: [signal]
            }));

            setLogs(prev => [...prev, `[POWER] ${signal.toUpperCase()} signal sent`]);
        }
    }, [isConnected]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (uptimeStartRef.current && serverStatus === "running") {
                const now = new Date();
                const diff = now.getTime() - uptimeStartRef.current.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setUptime(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [serverStatus]);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        isConnected,
        logs,
        error,
        serverStatus,
        stats,
        uptime,
        connect,
        disconnect,
        sendCommand,
        sendPowerSignal
    };
}