// src/app/(core)/dashboard/page.tsx
// This is a Server Component
import { fetchServers } from '@/app/_services/serverService';
import { DashboardClientPage } from './client';

export default async function DashboardPage() {
  // Fetch data on the server
  const servers = await fetchServers();
  
  // Pass data to client component
  return <DashboardClientPage initialServers={servers} />;
}