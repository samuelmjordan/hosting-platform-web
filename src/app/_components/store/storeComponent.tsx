'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Plan, Region, SupportedCurrency } from '@/app/types';
import { PriceGrid } from '@/app/_components/store/priceGrid';
import { RegionGrid } from '@/app/_components/store/regionGrid';
import { StoreCheckout } from '@/app/_components/store/storeCheckout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { startCheckout } from '@/app/_services/checkoutService';
import { fetchUserCurrency } from '@/app/_services/currencyService';

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
  const [isLockedCurrency, setIsLockedCurrency] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initCurrency = async () => {
      try {
        const userCurrency = await fetchUserCurrency();
        if (userCurrency !== 'XXX') {
          setCurrency(userCurrency);
          setIsLockedCurrency(true);
        } else {
          const userLocale = navigator.language;
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
        }
      } catch (error) {
        console.warn('Currency fetch failed:', error);
      }
    };

    initCurrency();
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
              {isLockedCurrency ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <div>
                        <select 
                          value={currency}
                          disabled
                          className="px-3 py-1 border rounded shadow-sm text-sm bg-white opacity-50 cursor-not-allowed"
                        >
                          <option value="USD">$ USD</option>
                          <option value="EUR">€ EUR</option>
                          <option value="GBP">£ GBP</option>
                        </select>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your account currency is locked.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                  className="px-3 py-1 border rounded shadow-sm text-sm bg-white"
                >
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PriceGrid
            plans={plans.filter((plan) => {
              console.log(plan.price.currency + " == " + currency)
              return plan.price.currency == currency
            })}
            selectedId={plan?.price.priceId ?? null}
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