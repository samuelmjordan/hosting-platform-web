'use client';

import React, { useState } from 'react';
import { Product, Region } from '@/app/types';
import SelectableGrid from '@/app/_components/storeComponent/selectableGrid';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cpu, MemoryStick, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mc-host-api-production.up.railway.app';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mc-host-web-production.up.railway.app';

interface StoreClientProps {
    products: Product[];
    regions: Region[];
}

interface CheckoutData {
    priceId: string;
    userId: string;
    success: string;
    cancel: string;
}

interface CheckoutError {
    message: string;
    code?: string;
}

export const StoreClient: React.FC<StoreClientProps> = ({ products, regions }) => {

    const { userId } = useAuth();
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getBaseUrl = (): string => {
        if (process.env.NODE_ENV === 'development') {
            return 'http://localhost:3000';
        }
        return BASE_URL;
    };

    const handleCheckout = async (
        priceId: string, 
        userId: string, 
        success: string, 
        cancel: string
    ): Promise<void> => {
        if (!selectedProduct || !selectedRegion) {
            setError('Please select both a product and region before proceeding');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const baseUrl = getBaseUrl();
            
            const checkoutData: CheckoutData = {
                priceId,
                userId,
                success: `${baseUrl}${success}`,
                cancel: `${baseUrl}${cancel}`
            };

            const response = await fetch(`${API_URL}/api/stripe/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(checkoutData)
            });

            if (!response.ok) {
                const errorData: CheckoutError = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const checkoutUrl = await response.text();
            console.log('Checkout session created:', checkoutUrl);
            router.push(checkoutUrl);
        } catch (error) {
            console.error('Error creating checkout session:', error);
            setError(error instanceof Error ? error.message : 'Failed to create checkout session');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-16 my-6" role="main" aria-label="Store selection interface">
            <div className="mb-6">
                <h2 className="mb-3 text-xl font-semibold">Server Package</h2>
                <Separator />
                
                <p className="mx-6 my-6">Java Edition</p>
                
                {/* Product Selection Grid with accessibility improvements */}
                <div role="region" aria-label="Server package selection">
                    <SelectableGrid<Product>
                        items={products}
                        getId={(product) => product.id.toString()}
                        renderTitle={(product) => product.title}
                        renderContent={(product) => (
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-2">
                                    <MemoryStick className="h-4 w-4" aria-hidden="true" />
                                    <span>{product.ram} GB RAM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Cpu className="h-4 w-4" aria-hidden="true" />
                                    <span>{product.cpu} Core CPU</span>
                                </div>
                            </div>
                        )}
                        onSelect={setSelectedProduct}
                        selectedId={selectedProduct?.id.toString()}
                    />
                </div>

                {/* Region Selection */}
                <div className="mb-6">
                    <h2 className="mb-3 text-xl font-semibold">Region</h2>
                    <Separator />
                    <div className="my-6"></div>
                    <div role="region" aria-label="Server region selection">
                        <SelectableGrid<Region>
                            items={regions}
                            getId={(region) => region.id.toString()}
                            renderTitle={(region) => region.continent}
                            renderContent={(region) => (
                                <div className="flex flex-col space-y-4">
                                    <span>{region.city}</span>
                                </div>
                            )}
                            onSelect={setSelectedRegion}
                            selectedId={selectedRegion?.id.toString()}
                        />
                    </div>
                </div>

                {/* Checkout Button with Loading State */}
                <Button 
                    className="mx-16 my-6"
                    onClick={() => {
                        if (userId) {
                            handleCheckout(
                                "price_1QpeRaLXiVvrT9k7sxzqqWa2",
                                userId,
                                "/return",
                                "/return"
                            );
                        } else {
                            setError("Please log in to proceed with checkout");
                        }
                    }}
                    disabled={!selectedProduct || !selectedRegion || isLoading || !userId}
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <p>Checkout</p>
                    )}
                </Button>

                {/* Error Display */}
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>Checkout request failed. Please try again.</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};