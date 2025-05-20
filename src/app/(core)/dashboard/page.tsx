import { fetchServers } from '@/app/_services/serverService';
import { DashboardClientPage } from './client';

export default async function DashboardPage() {
  const servers = await fetchServers();
  return <DashboardClientPage initialServers={servers} />;
}