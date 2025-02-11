export async function startCheckout(priceId: string, userId: string): Promise<string> {

    const checkoutData = {
        priceId,
        userId,
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/return`,
        cancel: `${process.env.NEXT_PUBLIC_BASE_URL}/return`
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });
  
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Prices not found for this product');
      }
      throw new Error('Failed to fetch prices');
    }
  
    return response.text();
  }