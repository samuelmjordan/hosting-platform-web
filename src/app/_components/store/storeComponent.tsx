"use client"

import { useEffect, useState } from "react"
import { Globe, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CurrencyAmount, Plan, Region, SupportedCurrency } from "@/app/types"
import { StoreCheckout } from "./storeCheckout"
import { useAuth } from "@clerk/nextjs"
import { startCheckout } from "@/app/_services/checkoutService"
import { useRouter } from "next/navigation"
import { fetchUserCurrency } from "@/app/_services/currencyService"

interface StoreProps {
  plans: Plan[];
  regions: Region[];
}

export function StoreComponent({ plans, regions }: StoreProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [currency, setCurrency] = useState('EUR');
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
        } else if (typeof navigator !== 'undefined') {
          const userLocale = navigator.language;
          const formatter = new Intl.NumberFormat(userLocale, {
            style: 'currency',
            currency: 'EUR'
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

  const formatCurrency = (amount: CurrencyAmount): string => {
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: amount.type
    }).format(amount.value / 100);
  };

  const selectCurrency = (currency: SupportedCurrency): void => {
    setCurrency(currency);
    setSelectedPlan(null);
  }

  const handleCheckout = async () => {
    if (!selectedPlan || !selectedRegion) {
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
      const checkoutUrl = await startCheckout(selectedPlan.price.price_id, selectedRegion.region_code);
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
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!isLockedCurrency ? 
            (<div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Configure Your Server</h2>
              <div className="flex items-center gap-4">
                <Select value={currency} onValueChange={selectCurrency}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='USD'>$ USD</SelectItem>
                    <SelectItem value='EUR'>€ EUR</SelectItem>
                    <SelectItem value='GBP'>£ GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>) : 
            (<div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Configure Your Server</h2>
              <TooltipProvider key=''>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-4">
                      <Select value={currency} onValueChange={selectCurrency} disabled>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='USD'>$ USD</SelectItem>
                          <SelectItem value='EUR'>€ EUR</SelectItem>
                          <SelectItem value='GBP'>£ GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your account is fixed to {currency}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>)}

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-medium mb-4">1. Select Server Package</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {plans
                  .filter((plan) => (plan.price.currency == currency as SupportedCurrency))
                  .map((plan) => (
                    <Card key={plan.specification.title + plan.price.currency} className={`relative ${plan.specification.title == "Iron" ? "border-pink-500 shadow-md" : ""}`}>
                      {plan.specification.title == "Iron" && <Badge className="absolute -top-2 right-4 bg-pink-500">Most Popular</Badge>}
                      <CardHeader>
                        <CardTitle>{plan.specification.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-gray-500" />
                            <span>{plan.specification.ram_gb} RAM</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-gray-500" />
                            <span>{plan.specification.cpu} CPU</span>
                          </li>
                        </ul>
                        <div className="mt-4">
                          <p className="text-2xl font-bold">{formatCurrency({type: plan.price.currency, value: plan.price.minor_amount})}</p>
                          <p className="text-sm text-gray-500">{"per month"}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant={plan.specification.title === "Iron" ? "default" : "outline"}
                          className={`w-full ${selectedPlan?.price.price_id === plan.price.price_id ? "bg-pink-600 hover:bg-pink-700 text-white" : ""}`}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          {selectedPlan?.price.price_id === plan.price.price_id ? "Selected" : "Select"}
                        </Button>
                      </CardFooter>
                    </Card>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-4">2. Select Region</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {regions.map((region) => (
                  <TooltipProvider key={region.region_code}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card
                            className={`cursor-pointer transition-colors ${
                              selectedRegion?.region_code === region.region_code
                                ? "border-pink-500 bg-pink-50"
                                : "hover:border-pink-500"
                            }`}
                            onClick={() => setSelectedRegion(region)}
                          >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{region.continent}</h4>
                                <p className="text-sm text-gray-500">{region.city}</p>
                                <p className="text-xs text-gray-400">Region: {region.region_code}</p>
                              </div>
                              <Globe className="h-8 w-8 text-gray-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tooltip</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </section>

            <section className="flex justify-end">
              <StoreCheckout
                isLoading={isLoading}
                error={error}
                disabled={!selectedPlan || !selectedRegion || !userId}
                onCheckout={handleCheckout}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
