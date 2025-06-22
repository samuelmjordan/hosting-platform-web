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

export default function PterodactylConsole({ subscriptionUid, className = "" }: PterodactylConsoleProps) {
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
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}>
        <div className="container mx-auto p-6 space-y-6">
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
      </div>
  );
}