import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, MemoryStick } from "lucide-react";

const products = [
  { id: BigInt(1), title: "Basic Server", ram: 8, cpu: 2 },
  { id: BigInt(2), title: "Standard Server", ram: 16, cpu: 4 },
  { id: BigInt(3), title: "Premium Server", ram: 32, cpu: 8 },
  { id: BigInt(4), title: "Enterprise Server", ram: 64, cpu: 16 },
];

const ProductGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-16">
        {products.map((product) => (
          <div
            key={product.id.toString()}
            className="group cursor-pointer"
          >
            <Card className="w-full h-full flex flex-col hover:scale-105 transition-transform duration-200 hover:border-primary">
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
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
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
};

export default ProductGrid;