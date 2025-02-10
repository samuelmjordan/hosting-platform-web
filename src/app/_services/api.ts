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
    // Make a GET request to the Spring API endpoint
    const response = await fetch(`/api/product/${productId}/prices`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Handle non-200 responses by throwing an APIError
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `Failed to fetch prices for product ${productId}`,
        response.status.toString()
      );
    }

    // Parse the response data
    const priceEntities = await response.json();

    // Transform the Spring API response to match the Price interface
    return priceEntities.map((entity: {
      priceId: string;
      productId: string;
      specId: string;
      active: boolean;
      currency: string;
      minorAmount: number;
    }) => ({
      priceId: entity.priceId,
      productId: entity.productId,
      specId: entity.specId,
      active: entity.active,
      currency: entity.currency.toLowerCase(), // Ensure currency is lowercase to match existing data
      minorAmount: entity.minorAmount
    }));
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