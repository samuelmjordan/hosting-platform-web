"use client"

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs'

interface PterodactylConsoleProps {
  subscriptionUid: string;
  className?: string;
}

interface ServerStats {
  memory_bytes: number;
  memory_limit_bytes: number;
  cpu_absolute: number;
  network: {
    rx_bytes: number;
    tx_bytes: number;
  };
  state: string;
  disk_bytes: number;
}

export default function PterodactylConsole({ subscriptionUid, className = "" }: PterodactylConsoleProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<string>("offline");
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [uptime, setUptime] = useState<string>("0h 0m 0s");
  
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const uptimeStartRef = useRef<Date | null>(null);
  const { user } = useUser();

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // uptime calculator
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

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KiB', 'MiB', 'GiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "running": return "text-green-400";
      case "starting": return "text-yellow-400";
      case "stopping": return "text-orange-400";
      case "offline": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const connect = async () => {
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
            console.log("server status:", newStatus);
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
        console.log("websocket closed:", event.code, event.reason);
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
  };

  const disconnect = () => {
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
  };

  const sendCommand = () => {
    if (wsRef.current && isConnected && command.trim()) {
      wsRef.current.send(JSON.stringify({
        event: "send command",
        args: [command.trim()]
      }));
      
      setLogs(prev => [...prev, `> ${command.trim()}`]);
      setCommand("");
    }
  };

  const sendPowerSignal = (signal: 'start' | 'stop' | 'restart' | 'kill') => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        event: "set state",
        args: [signal]
      }));
      
      setLogs(prev => [...prev, `[POWER] ${signal.toUpperCase()} signal sent`]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendCommand();
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className={`border rounded-lg bg-gray-800 text-white font-mono ${className}`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            status: <span className={getStatusColor(serverStatus)}>{serverStatus}</span>
          </span>
          <span className="text-sm text-gray-400">
            uptime: {uptime}
          </span>
        </div>
        <div className="space-x-2">
          <button
            onClick={connect}
            disabled={isConnected || !user?.id}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50 hover:bg-green-700"
          >
            connect
          </button>
          <button
            onClick={disconnect}
            disabled={!isConnected}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-50 hover:bg-red-700"
          >
            disconnect
          </button>
        </div>
      </div>

      {/* Resource Stats */}
      {stats && (
        <div className="p-4 border-b border-gray-700 bg-gray-850">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {/* CPU */}
            <div className="bg-gray-900 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">CPU Load</span>
                <span className="text-blue-400">{stats.cpu_absolute.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(stats.cpu_absolute, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Memory */}
            <div className="bg-gray-900 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Memory</span>
                <span className="text-green-400">
                  {formatBytes(stats.memory_bytes)} / {formatBytes(stats.memory_limit_bytes)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(stats.memory_bytes / stats.memory_limit_bytes) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Disk */}
            <div className="bg-gray-900 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Disk</span>
                <span className="text-yellow-400">{formatBytes(stats.disk_bytes)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: "25%" }} // placeholder since we don't have disk limit
                ></div>
              </div>
            </div>

            {/* Network */}
            <div className="bg-gray-900 p-3 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300">Network</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-purple-400">↓ {formatBytes(stats.network.rx_bytes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-400">↑ {formatBytes(stats.network.tx_bytes)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Power Controls */}
      <div className="p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => sendPowerSignal('start')}
            disabled={!isConnected}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50 hover:bg-green-700 transition-colors"
          >
            start
          </button>
          <button
            onClick={() => sendPowerSignal('stop')}
            disabled={!isConnected}
            className="px-4 py-2 bg-yellow-600 text-white rounded text-sm disabled:opacity-50 hover:bg-yellow-700 transition-colors"
          >
            stop
          </button>
          <button
            onClick={() => sendPowerSignal('restart')}
            disabled={!isConnected}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            restart
          </button>
          <button
            onClick={() => sendPowerSignal('kill')}
            disabled={!isConnected}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm disabled:opacity-50 hover:bg-red-700 transition-colors"
          >
            kill
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2 bg-red-900 border-red-700 text-red-300 text-sm border-b">
          error: {error}
        </div>
      )}

      <div className="h-96 overflow-y-auto p-4 space-y-1 bg-black text-green-400">
        {logs.map((log, i) => (
          <div key={i} className="text-sm whitespace-pre-wrap">
            {log}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 flex bg-gray-900">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a command..."
          disabled={!isConnected}
          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l border border-gray-600 border-r-0 focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          onClick={sendCommand}
          disabled={!isConnected || !command.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-r border border-blue-600 disabled:opacity-50 hover:bg-blue-700"
        >
          send
        </button>
      </div>
    </div>
  );
}