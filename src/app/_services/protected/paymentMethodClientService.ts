// client-side functions that call the single api route
export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
  const response = await fetch('/api/payment-methods/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'setDefault', paymentMethodId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to set default payment method');
  }
}

export async function removeDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
  const response = await fetch('/api/payment-methods/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'removeDefault', paymentMethodId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove default payment method');
  }
}

export async function removePaymentMethod(paymentMethodId: string): Promise<void> {
  const response = await fetch('/api/payment-methods/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'remove', paymentMethodId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove payment method');
  }
}

export async function createPaymentMethod(successUrl: string, cancelUrl: string): Promise<string> {
  const response = await fetch('/api/payment-methods/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'create', 
      successUrl,
      cancelUrl 
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create payment method');
  }
  
  const data = await response.json();
  return data.url;
}