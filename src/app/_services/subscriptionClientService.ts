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

export async function changeServerRegion(subscriptionId: string, region: string): Promise<void> {
  const response = await fetch('/api/user/subscription/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'change-region', subscriptionId, region })
  });
  
  if (!response.ok) {
    throw new Error('Failed to make change region request');
  }
}

export async function changeServerAddress(subscriptionId: string, address: string): Promise<void> {
  const response = await fetch('/api/user/subscription/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'change-address', subscriptionId, address })
  });
  
  if (!response.ok) {
    throw new Error('Failed to change server adress');
  }
}

export async function changeServerTitle(subscriptionId: string, title: string): Promise<void> {
  const response = await fetch('/api/user/subscription/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'change-title', subscriptionId, title })
  });
  
  if (!response.ok) {
    throw new Error('Failed to change server title');
  }
}

export async function changeServerSpecification(subscriptionId: string, specificationId: string): Promise<void> {
  const response = await fetch('/api/user/subscription/actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'change-specification', subscriptionId, specificationId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to change server specification');
  }
}