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
    <div className="mb-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-foreground">store</h1>
            </div>
            <div className="flex items-center gap-4">
                <CurrencySelector
                    currency={currency}
                    isLocked={isLockedCurrency}
                    onCurrencyChange={onCurrencyChange}
                />
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="mr-2">all our plans are:</span>
            <span className="px-2 py-1 bg-muted rounded-full text-xs">🇪🇺 based in europe</span>
            <span className="px-2 py-1 bg-muted rounded-full text-xs">☕ java-edition</span>
            <span className="px-2 py-1 bg-muted rounded-full text-xs">📅 rolling subscription</span>
            <span className="px-2 py-1 bg-muted rounded-full text-xs">📅 one-month term</span>
        </div>
    </div>
);