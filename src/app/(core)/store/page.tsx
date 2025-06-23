import { StoreComponent } from "@/app/_components/store/StoreComponent";
import { fetchPlans } from "@/app/_services/planService";
import { Plan } from "@/app/types";

export default async function StorePage() {
  const plans: Plan[] = await fetchPlans('GAME_SERVER');

  return (
  <div>
    <StoreComponent plans={plans} />
  </div>);
}