'use client';
import { Server } from "@/app/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EllipsisVertical, Copy, Check, HardDrive, Cpu } from 'lucide-react';
import { useState } from 'react';

const getStatusStyles = (active: boolean) => {
  return active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
};

// Format timestamp to readable date
const formatDate = (timestamp: number) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp * 1000000).toLocaleDateString();
};

// Format currency amount (assuming minor_amount is in cents)
const formatCurrency = (currency: string, amount: number) => {
  if (!amount) return "N/A";
  const majorAmount = amount / 100;
  
  switch (currency) {
    case "USD":
      return `$${majorAmount.toFixed(2)}`;
    case "EUR":
      return `€${majorAmount.toFixed(2)}`;
    case "GBP":
      return `£${majorAmount.toFixed(2)}`;
    default:
      return `${majorAmount.toFixed(2)} ${currency}`;
  }
};

// Format region code to readable name
const formatRegion = (regionCode: string) => {
  switch (regionCode) {
    case "WEST_EUROPE":
      return "West Europe";
    case "EAST_EUROPE":
      return "East Europe";
    default:
      return regionCode;
  }
};

interface DashboardTableProps {
  servers: Server[]
}
 
export function DashboardTable({
    servers,
  }: DashboardTableProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    
    const handleCopy = (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    };

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableCell colSpan={3} className="py-4">
                <h1 className="text-2xl font-bold">Server Dashboard</h1>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servers.map((server) => {
              const serverId = server.cname_record_name || server.name;
              return (
                <TableRow key={serverId} className="border-t">
                  {/* Server Name and Details Column */}
                  <TableCell className="py-5">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold mb-2">{server.name}</h2>
                      
                      {server.cname_record_name && (
                        <div className="flex items-center mb-4 text-sm">
                          <Copy 
                            size={16} 
                            className="text-gray-500 mr-2 cursor-pointer hover:text-gray-700"
                            onClick={() => handleCopy(server.cname_record_name || "", serverId)}
                          />
                          <span className="text-gray-500 font-mono">
                            {server.cname_record_name}
                          </span>
                          {copiedId === serverId && (
                            <span className="ml-2 text-green-500 text-xs">Copied!</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyles(server.subscription_status === "active")} font-medium`}>
                          {server.subscription_status == "active" ? "Online" : "Offline"}
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                          5/20
                        </span>
                        <span className="text-sm text-gray-600">{formatRegion(server.region_code)}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Plan & Subscription Details Column */}
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex items-center">
                        <span className="font-semibold text-lg mr-2">Iron Plan</span>
                        <span className="text-sm text-gray-600">{formatCurrency(server.currency, server.minor_amount)}/month</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <HardDrive className="h-4 w-4 mr-1" />
                          <span>8 GB RAM</span>
                        </div>
                        <div className="flex items-center">
                          <Cpu className="h-4 w-4 mr-1" />
                          <span>2 Core CPU</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Period ends: {formatDate(server.current_period_end)}
                        </span>
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyles(!server.cancel_at_period_end)} font-medium`}>
                          {server.cancel_at_period_end ? "Not Renewing" : "Renewing"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Action Button Column */}
                  <TableCell className="w-12">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <EllipsisVertical size={20} />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }