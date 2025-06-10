"use client"

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs'

interface PterodactylConsoleProps {
  subscriptionUid: string;
  className?: string;
}

export default function PterodactylConsole({ subscriptionUid, className = "" }: PterodactylConsoleProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const connect = async () => {
    try {
      setError(null);

      if (!user?.id) {
        setError("user not authenticated");
        return;
      }

      // connect to your spring websocket proxy instead of directly to pterodactyl
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
            // request server logs
            ws.send(JSON.stringify({
              event: "send logs",
              args: [null]
            }));
          } else if (data.event === "console output") {
            setLogs(prev => [...prev, data.args[0]]);
          } else if (data.event === "status") {
            console.log("server status:", data.args[0]);
          } else if (data.event === "token") {
            // handle token events if needed
            console.log("received token event");
          }
        } catch (e) {
          // if not json, treat as raw console output
          setLogs(prev => [...prev, event.data]);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        console.log("websocket closed:", event.code, event.reason);
        if (event.code !== 1000) { // not a normal closure
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
  };

  const sendCommand = () => {
    if (wsRef.current && isConnected && command.trim()) {
      wsRef.current.send(JSON.stringify({
        event: "send command",
        args: [command.trim()]
      }));
      
      // add command to logs for feedback
      setLogs(prev => [...prev, `> ${command.trim()}`]);
      setCommand("");
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
    <div className={`border rounded-lg bg-black text-green-400 font-mono ${className}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <span className="text-sm">
          status: {isConnected ? "connected" : "disconnected"}
          {user?.id && <span className="ml-2 text-gray-400">user: {user.id}</span>}
        </span>
        <div className="space-x-2">
          <button
            onClick={connect}
            disabled={isConnected || !user?.id}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
          >
            connect
          </button>
          <button
            onClick={disconnect}
            disabled={!isConnected}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-50"
          >
            disconnect
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2 bg-red-900 text-red-300 text-sm">
          error: {error}
        </div>
      )}

      <div className="h-96 overflow-y-auto p-4 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="text-sm whitespace-pre-wrap">
            {log}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      <div className="p-4 border-t flex">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="enter command..."
          disabled={!isConnected}
          className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-l border-r-0 focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={sendCommand}
          disabled={!isConnected || !command.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-r disabled:opacity-50"
        >
          send
        </button>
      </div>
    </div>
  );
}