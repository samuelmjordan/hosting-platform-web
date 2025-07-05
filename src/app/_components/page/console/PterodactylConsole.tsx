"use client"

import { useUser } from '@clerk/nextjs';
import { useWebSocket } from '@/app/_components/page/console/hooks/useWebsocket';
import { ConnectionStatus } from './ConnectionStatus';
import { ResourceStats } from './ResourceStats';
import { PowerControls } from './PowerControls';
import { ConsoleOutput } from './ConsoleOutput';
import {fetchSubscriptionResourceLimits} from "@/app/_services/protected/client/subscriptionClientService";
import {useEffect, useState} from "react";

interface PterodactylConsoleProps {
  subscriptionUid: string;
  className?: string;
}

export function PterodactylConsole({subscriptionUid}: PterodactylConsoleProps) {
    const {user} = useUser();
    const [limits, setLimits] = useState({
        subscriptionId: "null",
        cpu: 100,
        memory: 10 * 1024 * 1024 * 1024,
        disk: 30 * 1024 * 1024 * 1024,
        swap: 0,
        io: 0,
        threads: 0
    });
    const {
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
    } = useWebSocket(subscriptionUid);

    useEffect(() => {
        fetchSubscriptionResourceLimits(subscriptionUid).then(setLimits);
    }, [subscriptionUid]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Console</h1>
            </div>

            <ConnectionStatus
                isConnected={isConnected}
                serverStatus={serverStatus}
                uptime={uptime}
                onConnect={connect}
                onDisconnect={disconnect}
                isAuthenticated={!!user?.id}
            />

            {stats && <ResourceStats stats={stats} limits={limits}/>}

            <PowerControls
                isConnected={isConnected}
                onPowerSignal={sendPowerSignal}
            />

            <ConsoleOutput
                logs={logs}
                error={error}
                isConnected={isConnected}
                onSendCommand={sendCommand}
            />
        </div>
    );
}