"use client"

import { Server } from "@/app/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EllipsisVertical } from 'lucide-react';

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "online":
      return 'bg-green-200';
    case "offline":
      return 'bg-red-200';
    case "pending":
      return 'bg-yellow-200';
    default:
      return 'bg-gray-200';
  }
};

 
interface DashboardTableProps {
  servers: Server[]
}
 
export function DashboardTable({
    servers,
  }: DashboardTableProps) {
    return (
      <div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="sticky bg-background z-40">
            </TableHeader>
            <TableBody>
              {servers.map((server) => 
              <TableRow key={server.id}>
                <TableCell>
                  <div>
                    <h1 className="text-2xl font-bold mb-3">{server.title}</h1>
                    <p className="text-gray-600 mb-4 max-w-s line-clamp-3">{server.description}</p>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex px-3 py-1 text-sm rounded-full ${getStatusStyles(server.status)} font-semibold min-w-20 justify-center`}>
                        {server.status}
                      </span>
                      <span className={`inline-flex px-3 py-1 text-sm rounded-full bg-gray-100 font-semibold min-w-10 justify-center`}>
                        5/20
                      </span>
                      <span className="text-sm text-gray-600">Last online 2 hours ago</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <EllipsisVertical size={20} />
                  </button>
                </TableCell>
              </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }