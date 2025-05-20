'use client';

import { Server } from "@/app/types";
import { DashboardTable } from "@/app/_components/dashboard/dahboardTable"

interface DashboardClientPageProps {
  initialServers: Server[];
}

export function DashboardClientPage({ initialServers }: DashboardClientPageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <DashboardTable servers={initialServers} />
    </div>
  );
}