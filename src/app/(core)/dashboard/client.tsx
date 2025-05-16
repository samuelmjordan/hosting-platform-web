'use client';
// src/app/(core)/dashboard/client.tsx
// This is a Client Component

import { Server } from "@/app/types";
import { DashboardTable } from "@/app/_components/dashboard/dahboardTable"

interface DashboardClientPageProps {
  initialServers: Server[];
}

export function DashboardClientPage({ initialServers }: DashboardClientPageProps) {
  // Any client-side state management can go here
  
  return (
    <div className="container mx-auto py-6">
      <DashboardTable servers={initialServers} />
    </div>
  );
}