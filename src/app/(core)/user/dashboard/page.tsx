import { DashboardTable } from '@/app/_components/page/dashboard/DashboardTable';
import { fetchPlans } from '@/app/_services/public/planService';
import { fetchServers } from '@/app/_services/protected/server/serverService';
import { Plan, Server } from '@/app/types';

export default async function DashboardPage() {
  const servers: Server[] = await fetchServers();
  const plans: Plan[] = await fetchPlans('GAME_SERVER');

  return (
    <div className="flex-1 p-6">
      <DashboardTable
          servers={servers}
          plans={plans}
      />
    </div>
  );
}