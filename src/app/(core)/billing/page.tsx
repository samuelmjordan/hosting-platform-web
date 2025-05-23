import { fetchServers } from "@/app/_services/serverService"
import { BillingComponent } from "@/app/_components/billing/billingTable"

export default async function BillingPage() {
  const servers = await fetchServers();
  return (
    <div className="container mx-auto py-8 px-4">
      <BillingComponent servers={servers}/>
    </div>
  );
}