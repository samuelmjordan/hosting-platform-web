import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { PaymentMethod } from "@/app/types"
import { PaymentIcon, WalletIcon } from "./PaymentIcon"
import { PAYMENT_ICONS } from "../utils/constants"

interface PaymentMethodCardProps {
  method: PaymentMethod
  isLoading: boolean
  onSetDefault: () => void
  onRemoveDefault: () => void
  onRemove: () => void
  canUnsetDefault: boolean
}

export function PaymentMethodCard({
  method,
  isLoading,
  onSetDefault,
  onRemoveDefault,
  onRemove,
  canUnsetDefault
}: PaymentMethodCardProps) {
  const cardClasses = `transition-all hover:shadow-md ${
    method.is_default ? "ring-2 ring-blue-500 ring-opacity-20 bg-blue-50/50" : ""
  } ${!method.is_active ? "opacity-60" : ""}`
  
  return (
    <Card className={cardClasses}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <PaymentIcon type={method.type as any} brand={method.fields.brand?.value} />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{method.display_name}</h3>
                
                {method.is_default && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Check className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
                
                {!method.is_active && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Inactive
                  </Badge>
                )}
              </div>
              
              <PaymentMethodFields fields={method.fields} />
            </div>
          </div>
          
          <PaymentMethodActions
            method={method}
            isLoading={isLoading}
            onSetDefault={onSetDefault}
            onRemoveDefault={onRemoveDefault}
            onRemove={onRemove}
            canUnsetDefault={canUnsetDefault}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Helper component for rendering payment method fields
function PaymentMethodFields({ fields }: { fields: PaymentMethod['fields'] }) {
  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground">
      {Object.entries(fields).map(([key, field]) => {
        if (field.display_type === "brand_icon") {
          const iconUrl = PAYMENT_ICONS[field.value as keyof typeof PAYMENT_ICONS]
          return (
            <div key={key} className="flex items-center gap-2">
              {iconUrl && (
                <img 
                  src={iconUrl}
                  alt={field.value}
                  className="h-6 w-10 object-contain"
                />
              )}
              <span className="capitalize">{field.value}</span>
            </div>
          )
        }
        
        if (field.display_type === "wallet_icon") {
          return (
            <div key={key} className="flex items-center gap-2">
              <WalletIcon wallet={field.value} />
              <span className="capitalize">{field.value.replace("_", " ")}</span>
            </div>
          )
        }
        
        if (field.display_type === "masked") {
          return (
            <div key={key} className="flex items-center gap-1">
              {field.label && <span>{field.label}</span>}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                •••• {field.value}
              </span>
            </div>
          )
        }
        
        if (field.display_type === "text" && field.label) {
          return (
            <div key={key} className="flex items-center gap-1">
              <span>{field.label}</span>
              <span className="font-medium">{field.value}</span>
            </div>
          )
        }
        
        return null
      })}
    </div>
  )
}

// Helper component for action buttons
function PaymentMethodActions({
  method,
  isLoading,
  onSetDefault,
  onRemoveDefault,
  onRemove,
  canUnsetDefault
}: {
  method: PaymentMethod
  isLoading: boolean
  onSetDefault: () => void
  onRemoveDefault: () => void
  onRemove: () => void
  canUnsetDefault: boolean
}) {
  return (
    <div className="flex items-center space-x-2">
      {/* Set as Default button */}
      {!method.is_default && method.is_active && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={onSetDefault}
          disabled={isLoading}
        >
          {isLoading ? "Setting..." : "Set as Default"}
        </Button>
      )}
      
      {/* Unset Default button */}
      {method.is_default && canUnsetDefault && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-600 hover:text-red-700"
              disabled={isLoading}
            >
              Unset Default
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unset Default Payment Method</DialogTitle>
              <DialogDescription>
                Are you sure you want to unset {method.display_name} as the default payment method?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button
                variant="destructive"
                onClick={onRemoveDefault}
                disabled={isLoading}
              >
                {isLoading ? "Unsetting..." : "Unset Default"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Remove button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-red-600 hover:text-red-700"
            disabled={isLoading}
          >
            Remove
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {method.display_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button
              variant="destructive"
              onClick={onRemove}
              disabled={isLoading}
            >
              {isLoading ? "Removing..." : "Remove Method"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}