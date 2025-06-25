import { Package, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PaymentMethod } from "@/app/types"
import { PaymentMethodCard } from "./PaymentMethodCard"
import { SupportedPaymentTypes } from "./SupportedPaymentTypes"
import { usePaymentMethods } from "../hooks/usePaymentMethods"

interface PaymentMethodListProps {
    initialMethods: PaymentMethod[]
}

export function PaymentMethodList({ initialMethods }: PaymentMethodListProps) {
    const {
        methods,
        isLoading,
        addPaymentMethod,
        setDefault,
        removeDefault,
        remove
    } = usePaymentMethods(initialMethods)

    return (
        <div className="space-y-6">
            <Card className="shadow-sm dark:shadow-xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-foreground">Payment methods</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Manage your payment methods and billing preferences
                            </CardDescription>
                        </div>
                        <Button
                            className="shadow-sm hover:shadow dark:shadow-md dark:hover:shadow-lg transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={addPaymentMethod}
                            disabled={isLoading("add")}
                        >
                            <Package className="mr-2 h-4 w-4" />
                            {isLoading("add") ? "Adding..." : "Add payment method"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {methods.length === 0 ? (
                        <EmptyState onAdd={addPaymentMethod} isLoading={isLoading("add")} />
                    ) : (
                        <div className="space-y-4">
                            {methods.map((method) => (
                                <PaymentMethodCard
                                    key={method.id}
                                    method={method}
                                    isLoading={isLoading(method.id)}
                                    onSetDefault={() => setDefault(method.id, method.display_name)}
                                    onRemoveDefault={() => removeDefault(method.id, method.display_name)}
                                    onRemove={() => remove(method.id, method.display_name)}
                                    canUnsetDefault={methods.length > 1}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <SupportedPaymentTypes />
        </div>
    )
}

function EmptyState({ onAdd, isLoading }: { onAdd: () => void; isLoading: boolean }) {
    return (
        <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                no payment methods
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
                add a payment method to manage your subscriptions
            </p>
            <Button
                onClick={onAdd}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
                {isLoading ? "adding..." : "add payment method"}
            </Button>
        </div>
    )
}