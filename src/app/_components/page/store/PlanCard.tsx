import React from 'react';
import Image from 'next/image'
import { HardDrive, Server} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {CurrencyAmount, Plan, SupportedCurrency} from "@/app/types";

export interface PlanCardProps {
    plan: Plan;
    isSelected: boolean;
    isPopular?: boolean;
    onSelect: (plan: Plan) => void;
    formatCurrency: (amount: CurrencyAmount) => string;
    currency: SupportedCurrency;
}

export const PlanCard: React.FC<PlanCardProps> = ({
    plan,
    isSelected,
    isPopular = false,
    onSelect,
    formatCurrency,
    currency
}) => {
    const { specification, price } = plan;

    return (
        <Card className={cn(
            "relative transition-all duration-200 hover:shadow-md",
            isPopular && "border-accent shadow-md",
            isSelected && "ring-2 ring-accent"
        )}>
            {isPopular && (
                <Badge className="absolute -top-2 right-4 bg-accent hover:bg-accent/90">
                    most popular
                </Badge>
            )}

            <CardHeader>
                <div className="flex items-center gap-4">
                    <CardTitle className="flex-1">{specification.title}</CardTitle>
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                            src={`/${specification.title}.webp`}
                            alt={specification.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{specification.ram_gb} GB RAM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{specification.ssd_gb} GB SSD</span>
                    </div>
                </div>

                <div className="pt-2 border-t">
                    <p className="text-2xl font-bold">
                        {formatCurrency({
                            type: currency,
                            value: price.minor_amounts[currency]
                        })}
                    </p>
                    <p className="text-sm text-muted-foreground">per month</p>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    variant={isPopular || isSelected ? "default" : "outline"}
                    className={cn(
                        "w-full",
                        isSelected && "bg-accent hover:bg-accent/90"
                    )}
                    onClick={() => onSelect(plan)}
                >
                    {isSelected ? "Selected" : "Select"}
                </Button>
            </CardFooter>
        </Card>
    );
};