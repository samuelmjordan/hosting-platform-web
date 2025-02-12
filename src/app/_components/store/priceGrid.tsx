import React from 'react';
import { Plan, SupportedCurrency } from '@/app/types';
import SelectableGrid from "@/app/_components/store/selectableGrid";
import { Cpu, MemoryStick } from 'lucide-react';
import { formatCurrency } from '../currencySelector';

interface PriceGridProps {
  plans: Plan[];
  selectedId: string | null;
  currency: SupportedCurrency
  onSelect: (plan: Plan) => void;
}

export const PriceGrid: React.FC<PriceGridProps> = ({
  plans: plans,
  selectedId,
  currency,
  onSelect,
}) => (
  <SelectableGrid
    items={plans.filter((plan) => plan.price.currency == currency)}
    getId={(plan) => plan.price.priceId}
    selectedId={selectedId}
    onSelect={onSelect}
    renderTitle={(plan) => plan.spec.title}
    renderContent={(plan) => (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <MemoryStick className="h-4 w-4" />
          <span>{plan.spec.ram} GB RAM</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          <span>{plan.spec.cpu} Core CPU</span>
        </div>
        <div className="text-lg font-semibold">
          {formatCurrency({type: plan.price.currency, value: plan.price.minorAmount})}/month
        </div>
      </div>
    )}
  />
);