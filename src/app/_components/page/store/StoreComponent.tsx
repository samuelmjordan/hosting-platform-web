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
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Files, MapPin, Pencil, Shield, Terminal, Zap} from "lucide-react";

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
            const checkoutUrl = await startCheckout(selectedPlan.price.price_id, currency);
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
            <main className="flex-1">
                <section className="mb-6  py-8">
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
                </section>
                <section className="py-20 bg-muted">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="border hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle>European Data Centers</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Servers located in Germany for low latency anywhere in Europe
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Zap className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle>Instant Setup</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Your Minecraft server is ready in under 2 minutes with our one-click deployment
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle>DDoS Protection</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Enterprise-grade DDoS protection keeps your server online even during attacks
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Terminal className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle>Server Console</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Monitor your server and run commands remotely via our in-browser console terminal
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Pencil className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle>Mod Support</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Choose one of our preset minecraft installations, or upload your own custom setups
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Files className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle>SFTP</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Access your server via SFTP; or modify your files via our in-browser file explorer
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}