import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface StoreCheckoutProps {
    isLoading: boolean;
    error: string | null;
    disabled: boolean;
    onCheckout: () => void;
}

export const CheckoutButton: React.FC<StoreCheckoutProps> = ({
    isLoading,
    error,
    disabled,
    onCheckout,
}) => (
    <div className="space-y-4">
        <Button
            size="lg"
            className="px-8 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
            onClick={onCheckout}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : (
                'Checkout'
            )}
        </Button>

        {error && (
            <Alert variant="destructive">
                <AlertDescription>
                    Something went wrong. Please refresh the page and try again!
                </AlertDescription>
            </Alert>
        )}
    </div>
);