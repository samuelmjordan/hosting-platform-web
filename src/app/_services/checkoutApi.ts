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