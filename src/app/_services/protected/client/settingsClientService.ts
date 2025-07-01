import {StartupResponse, UpdateStartupRequest} from "@/app/_components/page/settings/utils/types";

export async function getSettings(subscriptionId: string): Promise<StartupResponse> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/settings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to get settings');
    }

    return response.json();
}

export async function updateSettings(subscriptionId: string, request: UpdateStartupRequest): Promise<StartupResponse> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('failed to update settings');
    }

    return response.json();
}

export async function reinstallServer(subscriptionId: string): Promise<void> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/settings/reinstall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to reinstall server');
    }
}

export async function recreateServer(subscriptionId: string): Promise<void> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/settings/recreate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to recreate server');
    }
}

export const formDataToRequest = (
    formData: {
        startup: string;
        image: string;
        eggId: number;
        environment: Record<string, string>;
    }
): UpdateStartupRequest => {
    return {
        startup_command: formData.startup,
        environment: formData.environment,
        egg_id: formData.eggId,
        image: formData.image,
    };
};