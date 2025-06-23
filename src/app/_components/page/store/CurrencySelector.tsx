import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {SupportedCurrency} from "@/app/types";

const CURRENCY_OPTIONS = [
    { value: 'USD' as const, label: '$ USD' },
    { value: 'EUR' as const, label: '€ EUR' },
    { value: 'GBP' as const, label: '£ GBP' },
] as const;

export interface CurrencySelectorProps {
    currency: SupportedCurrency;
    isLocked: boolean;
    onCurrencyChange: (currency: SupportedCurrency) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currency,
  isLocked,
  onCurrencyChange,
}) => {
    const selector = (
        <Select
            value={currency}
            onValueChange={(value: SupportedCurrency) => onCurrencyChange(value)}
            disabled={isLocked}
        >
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="currency" />
            </SelectTrigger>
            <SelectContent>
                {CURRENCY_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    if (!isLocked) return selector;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>{selector}</div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>your account is fixed to {currency}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};