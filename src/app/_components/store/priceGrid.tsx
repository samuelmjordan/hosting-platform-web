import React from 'react';
import { Plan, SupportedCurrency } from '@/app/types';
import SelectableGrid from "@/app/_components/store/selectableGrid";
import { Cpu, MemoryStick } from 'lucide-react';

interface CurrencyAmount {
  type: SupportedCurrency;
  value: number;
}

interface PriceGridProps {
  plans: Plan[];
  selectedId: string | null;
  onSelect: (plan: Plan) => void;
}

export const PriceGrid: React.FC<PriceGridProps> = ({
  plans: plans,
  selectedId,
  onSelect,
}) => (
  <SelectableGrid
    items={plans}
    getId={(plan) => plan.price.priceId}
    selectedId={selectedId}
    onSelect={onSelect}
    renderTitle={(plan) => plan.specification.title}
    renderContent={(plan) => (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <MemoryStick className="h-4 w-4" />
          <span>{plan.specification.ram_gb} GB RAM</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          <span>{plan.specification.cpu} Core CPU</span>
        </div>
        <div className="text-lg font-semibold">
          {formatCurrency({type: plan.price.currency, value: plan.price.minorAmount})}/month
        </div>
      </div>
    )}
  />
);

const formatCurrency = (amount: CurrencyAmount): string => {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: amount.type
  }).format(amount.value / 100);
};