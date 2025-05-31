import { Download } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Invoice } from "@/app/types"
import { formatCurrency, formatDate } from "../utils/formatters"

interface BillingHistoryProps {
  invoices: Invoice[]
}

export function BillingHistory({ invoices }: BillingHistoryProps) {
  // Sort invoices by date, newest first
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>
          View and download your past invoices across all subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedInvoices.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {sortedInvoices.map((invoice, index) => (
              <InvoiceRow key={`${invoice.invoice_number}-${index}`} invoice={invoice} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-all">
      <div>
        <p className="font-medium">{formatDate(invoice.created_at)}</p>
        <p className="text-muted-foreground text-sm">{invoice.invoice_number}</p>
        <p className="text-sm text-muted-foreground mt-1">{invoice.subscription_id}</p>
      </div>
      
      <div className="flex items-center mt-3 sm:mt-0">
        <Badge 
          variant="outline" 
          className={`mr-4 ${
            invoice.paid 
              ? "bg-green-50 text-green-700 border-green-100" 
              : "bg-red-50 text-red-700 border-red-100"
          }`}
        >
          {invoice.paid ? "Paid" : "Unpaid"}
        </Badge>
        
        <p className="font-medium mr-4">
          {formatCurrency({ type: invoice.currency, value: invoice.minor_amount })}
        </p>
        
        <Link href={invoice.link} target="_blank" className="hover:underline">
          <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
        <Download className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No invoices yet</h3>
      <p className="text-sm text-gray-500">
        Your billing history will appear here once you have active subscriptions.
      </p>
    </div>
  )
}