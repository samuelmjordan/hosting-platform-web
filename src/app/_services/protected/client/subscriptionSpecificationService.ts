import {SupportedCurrency} from "@/app/types";

export interface UpgradePreview {
    immediate_charge: number;
    new_monthly_amount: number;
    old_monthly_amount: number;
    currency: SupportedCurrency;
}

export interface UpgradeConfirmation {
    charged_amount: number;
    new_monthly_amount: number;
    currency: SupportedCurrency;
    invoice_id: string;
}

export async function previewUpgrade(
    subscriptionId: string,
    specificationId: string
): Promise<UpgradePreview> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/specification/preview`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specificationId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'preview failed');
    }

    const text = await response.text();
    return JSON.parse(text);
}

export async function confirmUpgrade(
    subscriptionId: string,
    specificationId: string
): Promise<UpgradeConfirmation> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/specification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specificationId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'upgrade failed');
    }

    const text = await response.text();
    return JSON.parse(text);
}