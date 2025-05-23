import { DashboardTable } from '@/app/_components/dashboard/dahboardTable';
import { fetchServers } from '@/app/_services/serverService';

export default async function DashboardPage() {
  const servers = await fetchServers();
  return (
    <div className="container mx-auto py-8 px-4">
      <DashboardTable servers={servers} />
    </div>
  );
}