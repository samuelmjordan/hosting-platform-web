import { SupportedCurrency } from "../../../types";

export async function fetchUserCurrency(): Promise<SupportedCurrency> {
    const response = await fetch('/api/user/currency', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Fetch currency failed');
    }

    const data = await response.json();
    return data.userCurrency as SupportedCurrency;
};
