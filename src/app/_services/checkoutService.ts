export async function startCheckout(priceId: string): Promise<string> {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    });

    if (!response.ok) {
        console.log(response);
        const error = await response.text();
        throw new Error(error || 'Checkout failed');
    }

    const data = await response.json();
    return data.url;
};
