"use client"

import { useUser } from '@clerk/nextjs';
import { useWebSocket } from '@/app/_components/console/hooks/useWebsocket';
import { ConnectionStatus } from './ConnectionStatus';
import { ResourceStats } from './ResourceStats';
import { PowerControls } from './PowerControls';
import { ConsoleOutput } from './ConsoleOutput';

interface PterodactylConsoleProps {
  subscriptionUid: string;
  className?: string;
}

export default function PterodactylConsole({ subscriptionUid }: PterodactylConsoleProps) {
  const { user } = useUser();
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

  return (
      <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">console</h1>
          </div>

        <ConnectionStatus
            isConnected={isConnected}
            serverStatus={serverStatus}
            uptime={uptime}
            onConnect={connect}
            onDisconnect={disconnect}
            isAuthenticated={!!user?.id}
        />

        {stats && <ResourceStats stats={stats} />}

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