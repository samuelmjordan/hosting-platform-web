'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Plan, Region } from '@/app/types';
import { PriceGrid } from '@/app/_components/store/priceGrid';
import { RegionGrid } from '@/app/_components/store/regionGrid';
import { StoreCheckout } from '@/app/_components/store/storeCheckout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { startCheckout } from '@/app/_services/checkoutService';

type SupportedCurrency = 'USD' | 'EUR' | 'GBP';

interface StoreProps {
  plans: Plan[];
  regions: Region[];
}

export const StoreComponent: React.FC<StoreProps> = ({ plans: plans, regions }) => {
  const router = useRouter();
  const { userId } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!plan || !region) {
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
      const checkoutUrl = await startCheckout(plan.price.priceId);
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
            plans={plans}
            selectedId={plan?.price.priceId ?? null}
            currency={currency}
            onSelect={setPlan}
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
            disabled={!plan || !region || !userId}
            onCheckout={handleCheckout}
          />
        </CardContent>
      </Card>
    </div>
  );
};