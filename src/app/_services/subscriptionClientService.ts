export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const response = await fetch('/api/user/subscription/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'cancel', subscriptionId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }
}

export async function uncancelSubscription(subscriptionId: string): Promise<void> {
  const response = await fetch('/api/user/subscription/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'uncancel', subscriptionId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to uncancel subscription');
  }
}