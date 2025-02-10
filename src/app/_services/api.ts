import { Product, Region } from '@/app/types';

const API_URL = process.env.API_URL;

export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const checkoutAPI = {
  async createCheckoutSession(params: {
    priceId: string;
    userId: string;
    success: string;
    cancel: string;
  }): Promise<string> {
    const response = await fetch(`${API_URL}/api/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.message || 'Checkout failed', error.code);
    }

    return response.text();
  }
  
};

export const pricesAPI = {
    async fetchProductPrices(params: {
      productId: string;
    }): Promise<Product[]> {
        return [
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07a", title: "Wooden Sword", ram: 2, cpu: 0.5, priceId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", priceAmount: 10},
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07b", title: "Stone Pickaxe", ram: 4, cpu: 1, priceId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", priceAmount: 10 },
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07c", title: "Iron Chestplate", ram: 6, cpu: 1.5, priceId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", priceAmount: 10}
        ];
    }
};

export const regionsAPI = {
    async fetchProductRegions(): Promise<Region[]> {
        return [
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07a", continent: "North America", continentCode: "NA", city: "Chicago" },
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07b", continent: "Western Europe", continentCode: "EUW", city: "Frankfurt" },
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07c", continent: "Eastern Europe", continentCode: "EUE", city: "Helsinki" },
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07d", continent: "Southeast Asia", continentCode: "SEA", city: "Singapore" },
        ];
    }
};