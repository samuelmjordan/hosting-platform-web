'use client';

import React from 'react';
import { Product, Region } from '@/app/types';
import SelectableGrid from '@/app/_components/selectableGrid';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"

const products: Product[] = [
    { id: BigInt(1), title: "Wooden Sword", ram: 2, cpu: 0.5 },
    { id: BigInt(2), title: "Stone Pickaxe", ram: 4, cpu: 1 },
    { id: BigInt(3), title: "Iron Chestplate", ram: 6, cpu: 1.5 },
    { id: BigInt(4), title: "Diamond Boots", ram: 8, cpu: 2 },
    { id: BigInt(5), title: "Crying Obsidian", ram: 12, cpu: 3 },
    { id: BigInt(6), title: "Golden Apple", ram: 16, cpu: 4 },
    { id: BigInt(7), title: "Netherite Ingot", ram: 24, cpu: 6 },
    { id: BigInt(8), title: "Nether Star", ram: 32, cpu: 8 },
];

const regions: Region[] = [
    { id: BigInt(1), continent: "North America", continentCode: "NA", city: "Chicago" },
    { id: BigInt(2), continent: "Western Europe", continentCode: "EUW", city: "Frankfurt" },
    { id: BigInt(3), continent: "Eastern Europe", continentCode: "EUE", city: "Helsinki" },
    { id: BigInt(4), continent: "Southeast Asia", continentCode: "SEA", city: "Singapore" },
];

const StoreAccordion = () => {
    return (
      <div className="mx-16 my-6">
        <div className="mb-6">
            <p>
                Server Package
            </p>
            <Separator />
            <p className="mx-6 my-6">
            Java Edition
            </p>
            <SelectableGrid<Product>
                items={products}
                getId={(product) => product.id.toString()}
                renderTitle={(product) => product.title}
                renderContent={(product) => (
                    <div className="flex flex-col space-y-4">
                    <span>{product.ram} GB RAM</span>
                    <span>{product.cpu} Core CPU</span>
                    </div>
                )}
            />
        </div>
        <div className="mb-6">
        <p>
            Region
        </p>
        <Separator />
        <div className = "my-6"></div>
        <SelectableGrid<Region>
            items={regions}
            getId={(region) => region.id.toString()}
            renderTitle={(region) => region.continent}
            renderContent={(region) => (
                <div className="flex flex-col space-y-4">
                <span>{region.city}</span>
                </div>
            )}
        />
        </div>
        <Button className="mx-16 my-6">
            <p>
                Checkout
            </p>
        </Button>
      </div>
    );
};

export default StoreAccordion;