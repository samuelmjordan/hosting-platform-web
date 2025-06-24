export enum ProvisioningStatus {
    READY = 'READY',
    INACTIVE = 'INACTIVE',
    PROVISIONING = 'PROVISIONING',
    DESTROYING = 'DESTROYING',
    MIGRATING = 'MIGRATING',
    FAILED = 'FAILED'
}

export interface ProvisioningStatusInfo {
    label: string;
    description: string;
}

export const getProvisioningStatusInfo = (status: ProvisioningStatus): ProvisioningStatusInfo => {
    switch (status) {
        case ProvisioningStatus.READY:
            return {
                label: 'Ready',
                description: 'Server is online and ready to use'
            };
        case ProvisioningStatus.INACTIVE:
            return {
                label: 'Inactive',
                description: 'Server is offline or suspended'
            };
        case ProvisioningStatus.PROVISIONING:
            return {
                label: 'Setting Up',
                description: 'Server is being created and configured'
            };
        case ProvisioningStatus.DESTROYING:
            return {
                label: 'Removing',
                description: 'Server is being deleted'
            };
        case ProvisioningStatus.MIGRATING:
            return {
                label: 'Migrating',
                description: 'Server is being moved to new hardware'
            };
        case ProvisioningStatus.FAILED:
            return {
                label: 'Failed',
                description: 'Something went wrong - contact support'
            };
        default:
            return {
                label: 'Unknown',
                description: 'Status not recognized'
            };
    }
};

export interface ProvisioningStatusResponse {
    subscriptionId: string;
    status: ProvisioningStatus;
}

export interface ResourceLimitResponse {
    subscriptionId: string;
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads: number;
}

export interface BatchError {
    subscriptionId: string;
    responseCode: number;
    errorMessage: string;
}

export interface BatchProvisioningStatusResponse {
    statuses: ProvisioningStatusResponse[];
    errors: BatchError[];
}

export interface BatchResourceLimitResponse {
    limits: ResourceLimitResponse[];
    errors: BatchError[];
}

export interface DashboardApiClient {
    getProvisioningStatus: (subscriptionId: string) => Promise<ProvisioningStatusResponse>;
    getBatchProvisioningStatus: (subscriptionIds: string[]) => Promise<BatchProvisioningStatusResponse>;
    getResourceLimits: (subscriptionId: string) => Promise<ResourceLimitResponse>;
    getBatchResourceLimits: (subscriptionIds: string[]) => Promise<BatchResourceLimitResponse>;
}

export class McHostDashboardClient implements DashboardApiClient {
    constructor(
        private baseUrl: string,
        private userId: string
    ) {}

    private async request<T>(
        method: string,
        endpoint: string,
        body?: any
    ): Promise<T> {
        const url = `${this.baseUrl}/api/dashboard${endpoint}`;

        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
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

    async getProvisioningStatus(subscriptionId: string): Promise<ProvisioningStatusResponse> {
        console.log('fetching provisioning status for subscription:', subscriptionId);

        try {
            const response = await this.request<ProvisioningStatusResponse>(
                'GET',
                `/user/${this.userId}/subscription/${subscriptionId}/status`
            );
            console.log('provisioning status response:', response);
            return response;
        } catch (error) {
            console.error('error in getProvisioningStatus:', error);
            throw error;
        }
    }

    async getBatchProvisioningStatus(subscriptionIds: string[]): Promise<BatchProvisioningStatusResponse> {
        console.log('fetching batch provisioning status for subscriptions:', subscriptionIds);

        try {
            const response = await this.request<BatchProvisioningStatusResponse>(
                'POST',
                `/user/${this.userId}/subscriptions/status`,
                subscriptionIds
            );
            console.log('batch provisioning status response:', response);
            return response;
        } catch (error) {
            console.error('error in getBatchProvisioningStatus:', error);
            throw error;
        }
    }

    async getResourceLimits(subscriptionId: string): Promise<ResourceLimitResponse> {
        console.log('fetching resource limits for subscription:', subscriptionId);

        try {
            const response = await this.request<ResourceLimitResponse>(
                'GET',
                `/user/${this.userId}/subscription/${subscriptionId}/limits`
            );
            console.log('resource limits response:', response);
            return response;
        } catch (error) {
            console.error('error in getResourceLimits:', error);
            throw error;
        }
    }

    async getBatchResourceLimits(subscriptionIds: string[]): Promise<BatchResourceLimitResponse> {
        console.log('fetching batch resource limits for subscriptions:', subscriptionIds);

        try {
            const response = await this.request<BatchResourceLimitResponse>(
                'POST',
                `/user/${this.userId}/subscriptions/limits`,
                subscriptionIds
            );
            console.log('batch resource limits response:', response);
            return response;
        } catch (error) {
            console.error('error in getBatchResourceLimits:', error);
            throw error;
        }
    }
}