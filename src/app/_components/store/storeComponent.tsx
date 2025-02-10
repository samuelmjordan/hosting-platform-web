'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Product, Region } from '@/app/types';
import { useStore } from '@/app/_hooks/useStore';
import { checkoutAPI } from '@/app/_services/api';
import { ProductGrid } from '@/app/_components/store/productGrid';
import { RegionGrid } from '@/app/_components/store/regionGrid';
import { StoreCheckout } from '@/app/_components/store/storeCheckout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StoreProps {
  products: Product[];
  regions: Region[];
}

export const StoreComponent: React.FC<StoreProps> = ({ products, regions }) => {
  const router = useRouter();
  const { userId } = useAuth();
  const { product, region, setProduct, setRegion } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!userId || !product || !region) {
      setError('Please select a product and region before proceeding');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.BASE_URL;
      const checkoutUrl = await checkoutAPI.createCheckoutSession({
        priceId: product.priceId,
        userId,
        success: `${baseUrl}/return`,
        cancel: `${baseUrl}/return`,
      });
      
      router.push(checkoutUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
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
          <ProductGrid
            products={products}
            selectedId={product?.id ?? null}
            onSelect={setProduct}
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
            disabled={!product || !region || !userId}
            onCheckout={handleCheckout}
          />
        </CardContent>
      </Card>
    </div>
  );
};