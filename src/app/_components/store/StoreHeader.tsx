import React from 'react';
import { CurrencySelector } from './CurrencySelector';
import {SupportedCurrency} from "@/app/types";

export interface StoreHeaderProps {
    currency: SupportedCurrency;
    isLockedCurrency: boolean;
    onCurrencyChange: (currency: SupportedCurrency) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
    currency,
    isLockedCurrency,
    onCurrencyChange,
}) => (
    <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">choose your server specs</h2>
        <div className="flex items-center gap-4">
            <CurrencySelector
                currency={currency}
                isLocked={isLockedCurrency}
                onCurrencyChange={onCurrencyChange}
            />
        </div>
    </div>
);