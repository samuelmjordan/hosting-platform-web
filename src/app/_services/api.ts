import { Price, Region } from '@/app/types';

export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const checkoutAPI = {
    async createCheckoutSession(priceId: string): Promise<string> {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
      }
  
      const data = await response.json();
      return data.url;
    }
};

export const activeProduct: string = "prod_RiiVxhDuwyX0qD";

export const pricesAPI = {
  async fetchProductPrices(productId: string): Promise<Price[]> {
    return [
      { priceId: "3c5f544a-e75b-4a5e-9607-cb65686af07a", productId: productId, specId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", active: true, currency: "usd", minorAmount: 10},
      { priceId: "3c5f544a-e75b-4a5e-9607-cb65686af07b", productId: productId, specId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", active: true, currency: "usd", minorAmount: 100},
      { priceId: "3c5f544a-e75b-4a5e-9607-cb65686af07c", productId: productId, specId: "price_1QpeRaLXiVvrT9k7sxzqqWa2", active: true, currency: "usd", minorAmount: 50}
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