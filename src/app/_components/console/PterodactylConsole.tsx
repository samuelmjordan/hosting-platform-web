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

interface AnsiSpan {
  text: string;
  className: string;
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
  const defaultColour = 'text-white'

  // ansi color mapping - keeping it simple but extensible
  const ansiColorMap: { [key: string]: string } = {
    '30': 'text-black',
    '31': 'text-red-400',
    '32': 'text-green-400', 
    '33': 'text-yellow-400',
    '34': 'text-blue-400',
    '35': 'text-purple-400',
    '36': 'text-cyan-400',
    '37': 'text-white',
    '39': defaultColour, // default - keeping console green theme
    '90': 'text-gray-500',
    '91': 'text-red-300',
    '92': 'text-green-300',
    '93': 'text-yellow-300',
    '94': 'text-blue-300',
    '95': 'text-purple-300',
    '96': 'text-cyan-300',
    '97': 'text-gray-200'
  };

  const parseAnsiString = (str: string): AnsiSpan[] => {
    const ansiRegex = /\x1b\[([0-9;]*)m/g;
    const spans: AnsiSpan[] = [];
    let lastIndex = 0;
    let currentClasses = [defaultColour]; // default console color
    let match;

    while ((match = ansiRegex.exec(str)) !== null) {
      // add text before this escape sequence
      if (match.index > lastIndex) {
        const text = str.slice(lastIndex, match.index);
        if (text) {
          spans.push({
            text,
            className: currentClasses.join(' ')
          });
        }
      }

      // parse the escape sequence
      const codes = match[1].split(';').filter(Boolean);
      
      for (const code of codes) {
        if (code === '0') {
          // reset all
          currentClasses = [defaultColour];
        } else if (code === '1') {
          // bold
          if (!currentClasses.includes('font-bold')) {
            currentClasses.push('font-bold');
          }
        } else if (ansiColorMap[code]) {
          // color - remove any existing color classes and add new one
          currentClasses = currentClasses.filter(cls => !cls.startsWith('text-'));
          currentClasses.push(ansiColorMap[code]);
        }
      }

      lastIndex = ansiRegex.lastIndex;
    }

    // add remaining text
    if (lastIndex < str.length) {
      const text = str.slice(lastIndex);
      if (text) {
        spans.push({
          text,
          className: currentClasses.join(' ')
        });
      }
    }

    return spans.length > 0 ? spans : [{ text: str, className: 'text-green-400' }];
  };

  const renderLogLine = (log: string, index: number) => {
    const spans = parseAnsiString(log);
    
    return (
      <div key={index} className="hover:bg-green-400/5 px-2 py-0.5 rounded transition-colors">
        {spans.map((span, spanIndex) => (
          <span key={spanIndex} className={span.className}>
            {span.text}
          </span>
        ))}
      </div>
    );
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

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
      case "running": return "text-emerald-400";
      case "starting": return "text-amber-400";
      case "stopping": return "text-orange-400";
      case "offline": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "running": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "starting": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "stopping": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "offline": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
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
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}>
      <div className="container mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'} 
                  ${isConnected ? 'animate-pulse' : ''}`}></div>
                {isConnected && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Server Console</h1>
                <div className="flex items-center gap-3 mt-1 text-sm">
                  <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusBadgeColor(serverStatus)}`}>
                    {serverStatus.toUpperCase()}
                  </span>
                  <span className="text-slate-400">uptime: {uptime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={connect}
                disabled={isConnected || !user?.id}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 
                  disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all
                  shadow-lg hover:shadow-emerald-500/25"
              >
                Connect
              </button>
              <button
                onClick={disconnect}
                disabled={!isConnected}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 
                  disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all
                  shadow-lg hover:shadow-red-500/25"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>

        {/* Resource Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* CPU */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-slate-300 font-medium">CPU Load</span>
                </div>
                <span className="text-blue-400 font-bold">{stats.cpu_absolute.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(stats.cpu_absolute, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Memory */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-slate-300 font-medium">Memory</span>
                </div>
                <span className="text-emerald-400 font-bold text-xs">
                  {formatBytes(stats.memory_bytes)}
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${(stats.memory_bytes / stats.memory_limit_bytes) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                of {formatBytes(stats.memory_limit_bytes)}
              </div>
            </div>

            {/* Disk */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span className="text-slate-300 font-medium">Disk Usage</span>
                </div>
                <span className="text-amber-400 font-bold text-xs">{formatBytes(stats.disk_bytes)}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>

            {/* Network */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-slate-300 font-medium">Network</span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">↓ Download</span>
                  <span className="text-purple-400 font-bold">{formatBytes(stats.network.rx_bytes)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">↑ Upload</span>
                  <span className="text-pink-400 font-bold">{formatBytes(stats.network.tx_bytes)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Power Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
            Power Controls
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => sendPowerSignal('start')}
              disabled={!isConnected}
              className="group px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 
                hover:border-emerald-500 text-emerald-400 hover:text-white rounded-lg font-medium 
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-emerald-500/25"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-white"></div>
                Start
              </div>
            </button>
            <button
              onClick={() => sendPowerSignal('stop')}
              disabled={!isConnected}
              className="group px-4 py-3 bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 
                hover:border-amber-500 text-amber-400 hover:text-white rounded-lg font-medium 
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-amber-500/25"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-white"></div>
                Stop
              </div>
            </button>
            <button
              onClick={() => sendPowerSignal('restart')}
              disabled={!isConnected}
              className="group px-4 py-3 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 
                hover:border-blue-500 text-blue-400 hover:text-white rounded-lg font-medium 
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-blue-500/25"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:bg-white"></div>
                Restart
              </div>
            </button>
            <button
              onClick={() => sendPowerSignal('kill')}
              disabled={!isConnected}
              className="group px-4 py-3 bg-red-600/20 hover:bg-red-600 border border-red-500/30 
                hover:border-red-500 text-red-400 hover:text-white rounded-lg font-medium 
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-red-500/25"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 group-hover:bg-white"></div>
                Kill
              </div>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
              <span className="text-red-400 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Console */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-slate-900/50 border-b border-slate-700/50 p-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              Console Output
            </h2>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 bg-black/50 font-mono text-sm leading-relaxed terminal-scroll">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic">No console output yet. Connect to start receiving logs...</div>
            ) : (
              logs.map((log, i) => renderLogLine(log, i))
            )}
            <div ref={logsEndRef} />
          </div>

          <div className="border-t border-slate-700/50 bg-slate-900/50 p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a command..."
                  disabled={!isConnected}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 
                    text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                    focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    font-mono text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="text-slate-500 text-xs">↵</div>
                </div>
              </div>
              <button
                onClick={sendCommand}
                disabled={!isConnected || !command.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 
                  disabled:opacity-50 text-white rounded-lg font-medium transition-all
                  shadow-lg hover:shadow-blue-500/25"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}