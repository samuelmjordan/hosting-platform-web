export async function startCheckout(price_id: string): Promise<string> {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price_id })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Checkout failed');
    }

    const data = await response.json();
    return data.url;
};
