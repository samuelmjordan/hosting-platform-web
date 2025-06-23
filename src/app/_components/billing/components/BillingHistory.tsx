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
    // sort invoices by date, newest first
    const sortedInvoices = [...invoices].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return (
        <Card className="shadow-sm dark:shadow-xl">
            <CardHeader>
                <CardTitle className="text-foreground">billing history</CardTitle>
                <CardDescription className="text-muted-foreground">
                    view and download your past invoices across all subscriptions
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:shadow-sm dark:hover:shadow-md transition-all hover:bg-accent/10">
            <div>
                <p className="font-medium text-foreground">{formatDate(invoice.created_at)}</p>
                <p className="text-muted-foreground text-sm">{invoice.invoice_number}</p>
                <p className="text-sm text-muted-foreground mt-1">{invoice.subscription_id}</p>
            </div>

            <div className="flex items-center mt-3 sm:mt-0">
                <Badge
                    variant="outline"
                    className={`mr-4 ${
                        invoice.paid
                            ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800"
                            : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800"
                    }`}
                >
                    {invoice.paid ? "paid" : "unpaid"}
                </Badge>

                <p className="font-medium mr-4 text-foreground">
                    {formatCurrency({ type: invoice.currency, value: invoice.minor_amount })}
                </p>

                <Link href={invoice.link} target="_blank" className="hover:underline">
                    <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full h-8 w-8 border-border hover:bg-accent"
                    >
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
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <Download className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">no invoices yet</h3>
            <p className="text-sm text-muted-foreground">
                your billing history will appear here once you have active subscriptions.
            </p>
        </div>
    )
}