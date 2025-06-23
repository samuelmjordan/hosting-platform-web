import { CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PAYMENT_ICONS } from "../utils/constants"

const paymentTypes = [
    {
        name: "payment cards",
        icon: (
            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-md flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </div>
        )
    },
    {
        name: "google pay",
        icon: (
            <div className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md flex items-center justify-center">
                <img
                    src={PAYMENT_ICONS.google}
                    alt="google pay"
                    className="h-6 w-6 object-contain"
                />
            </div>
        )
    },
    {
        name: "apple pay",
        icon: (
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                <img
                    src={PAYMENT_ICONS.apple}
                    alt="apple pay"
                    className="h-4 w-5 object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
            </div>
        )
    },
    {
        name: "samsung pay",
        icon: (
            <img
                src={PAYMENT_ICONS.samsung}
                alt="samsung pay"
                className="h-6 w-6 object-contain"
            />
        )
    }
]

export function SupportedPaymentTypes() {
    return (
        <Card className="shadow-sm dark:shadow-xl">
            <CardHeader>
                <CardTitle className="text-lg text-foreground">supported payment methods</CardTitle>
                <CardDescription className="text-muted-foreground">
                    we accept the following payment methods for your convenience
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {paymentTypes.map((type) => (
                        <div
                            key={type.name}
                            className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            {type.icon}
                            <span className="text-sm font-medium text-foreground">{type.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}