import React from 'react';
import { Region } from '@/app/types';
import SelectableGrid from "@/app/_components/store/selectableGrid";

interface RegionGridProps {
  regions: Region[];
  selectedId: string | null;
  onSelect: (region: Region) => void;
}

export const RegionGrid: React.FC<RegionGridProps> = ({
  regions,
  selectedId,
  onSelect,
}) => (
  <SelectableGrid
    items={regions}
    getId={(region) => region.regionId}
    selectedId={selectedId}
    onSelect={onSelect}
    renderTitle={(region) => region.continent}
    renderContent={(region) => (
      <div className="flex flex-col space-y-2">
        <span className="text-lg">{region.city}</span>
        <span className="text-sm text-muted-foreground">
          Region: {region.continentCode}
        </span>
      </div>
    )}
  />
);