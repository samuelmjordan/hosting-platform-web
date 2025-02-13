import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StoreCheckoutProps {
  isLoading: boolean;
  error: string | null;
  disabled: boolean;
  onCheckout: () => void;
}

export const StoreCheckout: React.FC<StoreCheckoutProps> = ({
  isLoading,
  error,
  disabled,
  onCheckout,
}) => (
  <div className="space-y-4">
    <Button
      className=""
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
        <AlertDescription>Something went wrong. Please refresh the page and try again!</AlertDescription>
      </Alert>
    )}
  </div>
);