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
  const cardClasses = `transition-all hover:shadow-md dark:hover:shadow-xl ${
      method.is_default ? "ring-2 ring-blue-500 ring-opacity-20 bg-blue-50/50 dark:bg-blue-950/20" : ""
  } ${!method.is_active ? "opacity-60" : ""}`

  return (
      <Card className={cardClasses}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <PaymentIcon type={method.type as any} brand={method.fields.brand?.value} />

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-foreground">{method.display_name}</h3>

                  {method.is_default && (
                      <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                        <Check className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                  )}

                  {!method.is_active && (
                      <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
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

// helper component for rendering payment method fields
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
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs text-foreground">
                •••• {field.value}
              </span>
                </div>
            )
          }

          if (field.display_type === "text" && field.label) {
            return (
                <div key={key} className="flex items-center gap-1">
                  <span>{field.label}</span>
                  <span className="font-medium text-foreground">{field.value}</span>
                </div>
            )
          }

          return null
        })}
      </div>
  )
}

// helper component for action buttons
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
        {/* set as default button */}
        {!method.is_default && method.is_active && (
            <Button
                variant="outline"
                size="sm"
                className="text-xs border-border hover:bg-accent"
                onClick={onSetDefault}
                disabled={isLoading}
            >
              {isLoading ? "Setting..." : "Set as default"}
            </Button>
        )}

        {/* unset default button */}
        {method.is_default && canUnsetDefault && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-border"
                    disabled={isLoading}
                >
                  Unset default
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Unset default payment method</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Are you sure you want to unset {method.display_name} as the default payment method?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" className="border-border hover:bg-accent">cancel</Button>
                  <Button
                      variant="destructive"
                      onClick={onRemoveDefault}
                      disabled={isLoading}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    {isLoading ? "Unsetting..." : "Unset default"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        )}

        {/* remove button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
                variant="outline"
                size="sm"
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-border"
                disabled={isLoading}
            >
              Remove
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Remove payment method</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to remove {method.display_name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" className="border-border hover:bg-accent">Cancel</Button>
              <Button
                  variant="destructive"
                  onClick={onRemove}
                  disabled={isLoading}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isLoading ? "Removing..." : "Remove method"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}