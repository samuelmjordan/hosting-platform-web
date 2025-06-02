import { DashboardTable } from '@/app/_components/dashboard/DashboardTable';
import { fetchPlans } from '@/app/_services/planService';
import { fetchRegions } from '@/app/_services/regionService';
import { fetchServers } from '@/app/_services/serverService';
import { Plan, Region, Server } from '@/app/types';

export default async function DashboardPage() {
  const servers: Server[] = await fetchServers();
  const plans: Plan[] = await fetchPlans('GAME_SERVER');
  const regions: Region[] = await fetchRegions();

  return (
    <div className="container mx-auto py-8 px-4">
      <DashboardTable servers={servers} plans={plans} regions={regions} />
    </div>
  );
}