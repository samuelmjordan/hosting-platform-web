import {
    EGG_OPTIONS,
    ServerSettingsApiClient,
    StartupResponse,
    UpdateStartupRequest
} from "@/app/_components/page/settings/utils/types";

export class PterodactylServerSettingsClient implements ServerSettingsApiClient {
    constructor(
        private baseUrl: string,
        private userId: string,
        private subscriptionId: string
    ) {}

    private async request<T>(
        method: string,
        endpoint: string,
        params?: URLSearchParams,
        body?: any
    ): Promise<T> {
        const url = `${this.baseUrl}/api/panel/user/${this.userId}/subscription/${this.subscriptionId}/settings${endpoint}${params ? `?${params}` : ''}`;

        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body && !(body instanceof FormData)) {
            options.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        const response = await fetch(url, options);

        console.log('response status:', response.status);
        console.log('response url:', url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('error response:', errorText);
            throw new Error(`api error: ${response.status} - ${errorText}`);
        }

        if (response.status === 204) {
            return undefined as T;
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return response.json();
        }

        return response.text() as T;
    }

    async getSettings(): Promise<StartupResponse> {
        console.log('fetching settings from:', `${this.baseUrl}/api/panel/user/${this.userId}/subscription/${this.subscriptionId}/settings`);

        try {
            const response = await this.request<StartupResponse>('GET', '');
            console.log('settings response:', response);
            return response;
        } catch (error) {
            console.error('error in getSettings:', error);
            throw error;
        }
    }

    async updateSettings(request: UpdateStartupRequest): Promise<StartupResponse> {
        console.log('updating settings:', request);

        try {
            const response = await this.request<StartupResponse>('PATCH', '', undefined, request);
            console.log('update response:', response);
            return response;
        } catch (error) {
            console.error('error in updateSettings:', error);
            throw error;
        }
    }

    async reinstallServer(): Promise<void> {
        console.log('initiating server reinstall');

        try {
            await this.request<void>('POST', '');
            console.log('reinstall initiated successfully');
        } catch (error) {
            console.error('error in reinstallServer:', error);
            throw error;
        }
    }

    async recreateServer(): Promise<void> {
        console.log('recreating server');

        try {
            await this.request<void>('POST', '/nuclear');
            console.log('recreate initiated successfully');
        } catch (error) {
            console.error('error in recreateServer:', error);
            throw error;
        }
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
    const selectedEgg = EGG_OPTIONS.find(egg => egg.id === formData.eggId);
    if (!selectedEgg) {
        throw new Error('invalid egg selection');
    }

    return {
        startup_command: formData.startup,
        environment: formData.environment,
        egg_id: selectedEgg.id,
        image: formData.image,
    };
};