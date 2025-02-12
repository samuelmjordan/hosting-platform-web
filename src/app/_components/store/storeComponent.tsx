'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Price, Region } from '@/app/types';
import { PriceGrid } from '@/app/_components/store/priceGrid';
import { RegionGrid } from '@/app/_components/store/regionGrid';
import { StoreCheckout } from '@/app/_components/store/storeCheckout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { startCheckout } from '@/app/_services/checkoutService';

type SupportedCurrency = 'USD' | 'EUR' | 'GBP';

interface StoreProps {
  prices: Price[];
  regions: Region[];
}

export const StoreComponent: React.FC<StoreProps> = ({ prices, regions }) => {
  const router = useRouter();
  const { userId } = useAuth();
  const [price, setPrice] = useState<Price | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // detect user's currency on mount
  React.useEffect(() => {
    const userLocale = navigator.language;
    try {
      const formatter = new Intl.NumberFormat(userLocale, {
        style: 'currency',
        currency: 'USD'
      });
      const detectedCurrency = formatter.formatToParts(0)
        .find(part => part.type === 'currency')
        ?.value as SupportedCurrency;
      
      if (['USD', 'EUR', 'GBP'].includes(detectedCurrency)) {
        setCurrency(detectedCurrency);
      }
    } catch (error) {
      console.warn('Currency detection failed:', error);
    }
  }, []);

  const handleCheckout = async () => {
    if (!price || !region) {
      setError('Please select both a product and region before proceeding');
      return;
    }

    if (!userId) {
      setError('Please login before proceeding');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const checkoutUrl = await startCheckout(price.priceId);
      console.log(checkoutUrl);
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
            <div className="flex justify-between items-center">
              <CardTitle>Select Server Package</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Currency:</span>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                  className="px-3 py-1 border rounded shadow-sm text-sm bg-white"
                >
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>
            </div>
          </CardHeader>
        <CardContent>
          <PriceGrid
            prices={prices}
            selectedId={price?.priceId ?? null}
            currency={currency}
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
            selectedId={region?.regionId ?? null}
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