export const dynamic = 'force-dynamic';

import { StoreComponent } from "@/app/_components/store/storeComponent";
import { fetchPlans } from "@/app/_services/planService";
import { fetchRegions } from "@/app/_services/regionService";
import { Plan, Region } from "@/app/types";

export default async function StorePage() {
  const plans: Plan[] = await fetchPlans('JAVA_SERVER');
  const regions: Region[] = await fetchRegions();

  return (
  <div>
    <StoreComponent plans={plans} regions={regions} />
  </div>);
}