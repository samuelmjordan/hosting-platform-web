"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SelectableGridProps<T> {
  items: T[];
  getId: (item: T) => string;
  renderTitle: (item: T) => React.ReactNode;
  renderContent: (item: T) => React.ReactNode;
  onSelect?: (item: T) => void;
  selectedId?: string | null;
  className?: string;
}

function SelectableGrid<T>({
  items,
  getId,
  renderTitle,
  renderContent,
  onSelect,
  selectedId: externalSelectedId,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-16 my-6"
}: SelectableGridProps<T>) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  
  const selectedId = externalSelectedId ?? internalSelectedId;

  const handleSelect = (item: T): void => {
    const id = getId(item);
    if (onSelect) {
      onSelect(item);
    } else {
      setInternalSelectedId(id);
    }
  };

  return (
    <div 
      role="radiogroup" 
      aria-label="Grid selection" 
      className={className}
    >
      {items.map((item) => {
        const id = getId(item);
        const isSelected = selectedId === id;
        
        return (
          <div
            key={id}
            className="group cursor-pointer"
            onClick={() => handleSelect(item)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSelect(item);
              }
            }}
          >
            <Card 
              className={`w-full h-full flex flex-col transition-all duration-200 ${
                isSelected 
                  ? 'border-primary border-2 shadow-lg scale-105' 
                  : 'hover:scale-105 hover:border-primary'
              }`}
            >
              <CardHeader>
                <CardTitle>{renderTitle(item)}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {renderContent(item)}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default SelectableGrid;