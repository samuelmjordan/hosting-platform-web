import React from 'react';
import { Price } from '@/app/types';
import SelectableGrid from "@/app/_components/store/selectableGrid";
import { Cpu, MemoryStick } from 'lucide-react';

interface PriceGridProps {
  prices: Price[];
  selectedId: string | null;
  onSelect: (price: Price) => void;
}

export const PriceGrid: React.FC<PriceGridProps> = ({
  prices: prices,
  selectedId,
  onSelect,
}) => (
  <SelectableGrid
    items={prices}
    getId={(price) => price.priceId}
    selectedId={selectedId}
    onSelect={onSelect}
    renderTitle={(price) => "Title" + price.currency}
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
          {price.minorAmount}{price.currency}/month
        </div>
      </div>
    )}
  />
);