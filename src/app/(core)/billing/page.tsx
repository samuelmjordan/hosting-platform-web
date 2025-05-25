import { fetchServers } from "@/app/_services/serverService"
import { BillingComponent } from "@/app/_components/billing/billingTable"
import { fetchInvoices } from "@/app/_services/invoiceService";

export default async function BillingPage() {
  const servers = await fetchServers();
  const invoices = await fetchInvoices();
  return (
    <div className="container mx-auto py-8 px-4">
      <BillingComponent servers={servers} invoices={invoices}/>
    </div>
  );
}