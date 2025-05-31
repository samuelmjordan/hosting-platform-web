import { CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PAYMENT_ICONS } from "../utils/constants"

const paymentTypes = [
  {
    name: "Payment Cards",
    icon: (
      <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
        <CreditCard className="h-5 w-5 text-gray-700" />
      </div>
    )
  },
  {
    name: "Google Pay",
    icon: (
      <div className="w-8 h-8 bg-white border border-gray-200 rounded-md flex items-center justify-center">
        <img 
          src={PAYMENT_ICONS.google}
          alt="Google Pay"
          className="h-6 w-6 object-contain"
        />
      </div>
    )
  },
  {
    name: "Apple Pay",
    icon: (
      <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
        <img 
          src={PAYMENT_ICONS.apple}
          alt="Apple Pay"
          className="h-4 w-5 object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>
    )
  },
  {
    name: "Samsung Pay",
    icon: (
      <img 
        src={PAYMENT_ICONS.samsung}
        alt="Samsung Pay"
        className="h-6 w-6 object-contain"
      />
    )
  }
]

export function SupportedPaymentTypes() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Supported Payment Methods</CardTitle>
        <CardDescription>
          We accept the following payment methods for your convenience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paymentTypes.map((type) => (
            <div 
              key={type.name}
              className="flex items-center space-x-3 p-3 border rounded-lg"
            >
              {type.icon}
              <span className="text-sm font-medium">{type.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}