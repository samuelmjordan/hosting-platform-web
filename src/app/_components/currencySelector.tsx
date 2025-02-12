import React, { useState, useEffect } from 'react';
import { SupportedCurrency } from '@/app/types';

interface CurrencyAmount {
  type: SupportedCurrency;
  value: number;
}

interface CurrencySelectorProps {
  onCurrencySelect: (currency: SupportedCurrency) => void;
  initialCurrency?: SupportedCurrency;
}

interface CurrencyState {
  detected: SupportedCurrency;
  selected: SupportedCurrency;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  onCurrencySelect, 
  initialCurrency = 'USD' 
}) => {
  const [state, setState] = useState<CurrencyState>({
    detected: initialCurrency,
    selected: initialCurrency
  });

  useEffect(() => {
    const detectUserCurrency = (): SupportedCurrency => {
      const userLocale = navigator.language;
      
      try {
        const formatter = new Intl.NumberFormat(userLocale, {
          style: 'currency',
          currency: 'USD'
        });
        
        const formattedCurrency = formatter.formatToParts(0)
          .find(part => part.type === 'currency')
          ?.value as string;
        
        const isSupportedCurrency = (currency: string): currency is SupportedCurrency => 
          ['USD', 'EUR', 'GBP'].includes(currency);
        
        return isSupportedCurrency(formattedCurrency) ? formattedCurrency : 'USD';
      } catch (error) {
        console.warn('Currency detection failed:', error);
        return 'USD';
      }
    };

    const detectedCurrency = detectUserCurrency();
    setState(prev => ({
      ...prev,
      detected: detectedCurrency,
      selected: detectedCurrency
    }));
    onCurrencySelect(detectedCurrency);
  }, [onCurrencySelect]);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = event.target.value as SupportedCurrency;
    setState(prev => ({ ...prev, selected: newCurrency }));
    onCurrencySelect(newCurrency);
  };

  return (
    <div className="p-4">
      <select 
        value={state.selected}
        onChange={handleCurrencyChange}
        className="p-2 border rounded shadow-sm"
      >
        <option value="USD">$ USD</option>
        <option value="EUR">€ EUR</option>
        <option value="GBP">£ GBP</option>
      </select>
      <p className="mt-2 text-sm text-gray-600">
        Detected currency: {state.detected}
      </p>
    </div>
  );
};

export default CurrencySelector;

export const formatCurrency = (amount: CurrencyAmount): string => {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: amount.type
  }).format(amount.value / 100);
};