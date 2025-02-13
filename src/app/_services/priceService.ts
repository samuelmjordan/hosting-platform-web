'server only'

import { Price } from "@/app/types";

export async function fetchPrices(productId: string): Promise<Price[]> {
    const response = await fetch(`${process.env.API_URL}/api/product/${productId}/prices`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Prices not found for this product');
      }
      throw new Error('Failed to fetch prices');
    }
  
    return response.json();
}