'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Price, Region } from '@/app/types';
import { useStore } from '@/app/_hooks/useStore';
import { checkoutAPI } from '@/app/_services/checkoutApi';
import { PriceGrid } from '@/app/_components/store/priceGrid';
import { RegionGrid } from '@/app/_components/store/regionGrid';
import { StoreCheckout } from '@/app/_components/store/storeCheckout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StoreProps {
  prices: Price[];
  regions: Region[];
}

export const StoreComponent: React.FC<StoreProps> = ({ prices, regions }) => {
  const router = useRouter();
  const { userId } = useAuth();
  const { price, region, setPrice, setRegion } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!price || !region) {
      setError('Please select both a product and region before proceeding');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const checkoutUrl = await checkoutAPI.createCheckoutSession(
        price.priceId
      );
      
      router.push(checkoutUrl);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error instanceof Error ? error.message : 'Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Select Server Package</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceGrid
            prices={prices}
            selectedId={price?.priceId ?? null}
            onSelect={setPrice}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Region</CardTitle>
        </CardHeader>
        <CardContent>
          <RegionGrid
            regions={regions}
            selectedId={region?.id ?? null}
            onSelect={setRegion}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <StoreCheckout
            isLoading={isLoading}
            error={error}
            disabled={!price || !region || !userId}
            onCheckout={handleCheckout}
          />
        </CardContent>
      </Card>
    </div>
  );
};