import React from 'react';
import { Price, SupportedCurrency } from '@/app/types';
import SelectableGrid from "@/app/_components/store/selectableGrid";
import { Cpu, MemoryStick } from 'lucide-react';
import { formatCurrency } from '../currencySelector';

interface PriceGridProps {
  prices: Price[];
  selectedId: string | null;
  currency: SupportedCurrency
  onSelect: (price: Price) => void;
}

export const PriceGrid: React.FC<PriceGridProps> = ({
  prices: prices,
  selectedId,
  currency,
  onSelect,
}) => (
  <SelectableGrid
    items={prices.filter((price) => price.currency == currency)}
    getId={(price) => price.priceId}
    selectedId={selectedId}
    onSelect={onSelect}
    renderTitle={() => "Title"}
    renderContent={(price) => (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <MemoryStick className="h-4 w-4" />
          <span>{"100"} GB RAM</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          <span>{"100"} Core CPU</span>
        </div>
        <div className="text-lg font-semibold">
          {formatCurrency({type: price.currency, value: price.minorAmount})}/month
        </div>
      </div>
    )}
  />
);