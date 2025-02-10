import React from 'react';
import { Product } from '@/app/types';
import SelectableGrid from "@/app/_components/store/selectableGrid";
import { Cpu, MemoryStick } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedId: string | null;
  onSelect: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedId,
  onSelect,
}) => (
  <SelectableGrid
    items={products}
    getId={(product) => product.id}
    selectedId={selectedId}
    onSelect={onSelect}
    renderTitle={(product) => product.title}
    renderContent={(product) => (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <MemoryStick className="h-4 w-4" />
          <span>{product.ram} GB RAM</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          <span>{product.cpu} Core CPU</span>
        </div>
        <div className="text-lg font-semibold">
          ${product.priceAmount}/month
        </div>
      </div>
    )}
  />
);