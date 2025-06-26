"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { StoreHeader } from "./StoreHeader"
import { PlansGrid } from "./PlansGrid"
import { CheckoutButton } from "./CheckoutButton"
import { startCheckout } from "@/app/_services/protected/client/checkoutService"
import { fetchUserCurrency } from "@/app/_services/protected/client/currencyService"
import {CurrencyAmount, Plan, SupportedCurrency} from "@/app/types";

interface StoreComponentProps {
    plans: Plan[];
}

const detectUserCurrency = (): SupportedCurrency => {
    if (typeof navigator === 'undefined') return 'EUR';

    try {
        const userLocale = navigator.language;
        const formatter = new Intl.NumberFormat(userLocale, {
            style: 'currency',
            currency: 'EUR'
        });

        const detectedCurrency = formatter.formatToParts(0)
            .find(part => part.type === 'currency')
            ?.value as SupportedCurrency;

        return ['USD', 'EUR', 'GBP'].includes(detectedCurrency) ? detectedCurrency : 'EUR';
    } catch {
        return 'EUR';
    }
};

export function StoreComponent({ plans }: StoreComponentProps) {
    const router = useRouter();
    const { userId } = useAuth();

    // state management
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [currency, setCurrency] = useState<SupportedCurrency>('EUR');
    const [isLockedCurrency, setIsLockedCurrency] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // currency formatting utility
    const formatCurrency = useCallback((amount: CurrencyAmount): string => {
        const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: amount.type
        }).format(amount.value / 100);
    }, []);

    // initialize user currency on mount
    useEffect(() => {
        const initializeCurrency = async () => {
            try {
                const userCurrency = await fetchUserCurrency();

                if (userCurrency !== 'XXX') {
                    setCurrency(userCurrency);
                    setIsLockedCurrency(true);
                } else {
                    setCurrency(detectUserCurrency());
                }
            } catch (error) {
                console.warn('Currency fetch failed:', error);
                setCurrency(detectUserCurrency());
            }
        };

        initializeCurrency();
    }, []);

    // handlers
    const handleCurrencyChange = useCallback((newCurrency: SupportedCurrency) => {
        setCurrency(newCurrency);
        setSelectedPlan(null); // reset selection when currency changes
    }, []);

    const handlePlanSelect = useCallback((plan: Plan) => {
        setSelectedPlan(plan);
        setError(null); // clear any previous errors
    }, []);

    const handleCheckout = useCallback(async () => {
        if (!selectedPlan) {
            setError('Please select a product before proceeding');
            return;
        }

        if (!userId) {
            setError('Please login before proceeding');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const checkoutUrl = await startCheckout(selectedPlan.price.price_id);
            router.push(checkoutUrl);
        } catch (error) {
            console.error('Checkout error:', error);
            setError(error instanceof Error ? error.message : 'Failed to create checkout session');
        } finally {
            setIsLoading(false);
        }
    }, [selectedPlan, userId, router]);

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <StoreHeader
                        currency={currency}
                        isLockedCurrency={isLockedCurrency}
                        onCurrencyChange={handleCurrencyChange}
                    />

                    <div className="space-y-8">
                        <PlansGrid
                            plans={plans}
                            currency={currency}
                            selectedPlan={selectedPlan}
                            onPlanSelect={handlePlanSelect}
                            formatCurrency={formatCurrency}
                        />

                        <section className="flex justify-end">
                            <CheckoutButton
                                isLoading={isLoading}
                                error={error}
                                disabled={!selectedPlan || !userId}
                                onCheckout={handleCheckout}
                            />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}