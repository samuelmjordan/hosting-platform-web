import { fetchServers } from "@/app/_services/protected/serverService"
import { fetchInvoices } from "@/app/_services/protected/invoiceService"
import { fetchPaymentMethods } from "@/app/_services/protected/paymentMethodServerService"
import { BillingPage } from "@/app/_components/page/billing/BillingPage"

export default async function BillingRoute() {
  const servers = await fetchServers()
  const invoices = await fetchInvoices()
  const paymentMethods = await fetchPaymentMethods()
  
  return (
    <BillingPage
      servers={servers}
      invoices={invoices}
      paymentMethods={paymentMethods}
    />
  )
}