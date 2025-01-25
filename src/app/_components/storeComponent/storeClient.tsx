'use client';

import React, { useState } from 'react';
import { Product, Region } from '@/app/types';
import SelectableGrid from '@/app/_components/storeComponent/selectableGrid';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Cpu, MemoryStick } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StoreClientProps {
    products: Product[];
    regions: Region[];
}

export const StoreClient: React.FC<StoreClientProps> = ({ products, regions }) => {
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

    const handleCheckout = () => {
        if (selectedProduct && selectedRegion) {
            console.log('Checking out with:', { selectedProduct, selectedRegion });
            router.push(selectedProduct.link);
        }
    };

    return (
        <div className="mx-16 my-6">
            <div className="mb-6">
                <p className="mb-3">Server Package</p>
                <Separator />
                <p className="mx-6 my-6">Java Edition</p>
                <SelectableGrid<Product>
                    items={products}
                    getId={(product) => product.id.toString()}
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
                        </div>
                    )}
                    onSelect={setSelectedProduct}
                    selectedId={selectedProduct?.id.toString()}
                />
                <div className="mb-6">
                    <p className="mb-3">Region</p>
                    <Separator />
                    <div className="my-6"></div>
                    <SelectableGrid<Region>
                        items={regions}
                        getId={(region) => region.id.toString()}
                        renderTitle={(region) => region.continent}
                        renderContent={(region) => (
                            <div className="flex flex-col space-y-4">
                                <span>{region.city}</span>
                            </div>
                        )}
                        onSelect={setSelectedRegion}
                        selectedId={selectedRegion?.id.toString()}
                    />
                </div>
                <Button 
                    className="mx-16 my-6"
                    onClick={handleCheckout}
                    disabled={!selectedProduct || !selectedRegion}
                >
                    <p>Checkout</p>
                </Button>
            </div>
        </div>
    );
};