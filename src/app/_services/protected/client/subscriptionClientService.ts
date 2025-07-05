import {ProvisioningStatus, ResourceLimitResponse} from "@/app/types";

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const response = await fetch(`/api/user/subscription/${subscriptionId}/actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'cancel' })
  });

  if (!response.ok) {
    throw new Error('failed to cancel subscription');
  }
}

export async function uncancelSubscription(subscriptionId: string): Promise<void> {
  const response = await fetch(`/api/user/subscription/${subscriptionId}/actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'uncancel' })
  });

  if (!response.ok) {
    throw new Error('failed to uncancel subscription');
  }
}

export async function changeServerAddress(subscriptionId: string, address: string): Promise<void> {
  const response = await fetch(`/api/user/subscription/${subscriptionId}/actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'change-address', address })
  });

  if (!response.ok) {
    throw new Error('failed to change server address');
  }
}

export async function changeServerTitle(subscriptionId: string, title: string): Promise<void> {
  const response = await fetch(`/api/user/subscription/${subscriptionId}/actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'change-title', title })
  });

  if (!response.ok) {
    throw new Error('failed to change server title');
  }
}

export async function fetchSubscriptionProvisioningStatus(subscriptionId: string): Promise<ProvisioningStatus> {
  const response = await fetch(`/api/user/subscription/${subscriptionId}/status`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('failed to fetch provisioning status');
  }

  const data = await response.json();
  return data.provisioningStatus.status;
}

export async function fetchSubscriptionResourceLimits(subscriptionId: string): Promise<ResourceLimitResponse> {
  const response = await fetch(`/api/user/subscription/${subscriptionId}/limits`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('failed to fetch provisioning status');
  }

  const data = await response.json();
  return data;
}