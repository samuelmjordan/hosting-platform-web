import {Backup, BackupApiClient} from "@/app/_components/backups/utils/types";

export class PterodactylBackupClient implements BackupApiClient {
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
        const url = `${this.baseUrl}/api/panel/user/${this.userId}/subscription/${this.subscriptionId}/backup${endpoint}${params ? `?${params}` : ''}`;

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

        console.log('Response status:', response.status);
        console.log('Response URL:', url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
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

    listBackups(): Promise<Backup[]> {
        return this.request<Backup[]>('GET', '');
    }

    createBackup(name: string): Promise<Backup> {
        return this.request<Backup>('POST', '', new URLSearchParams({ name }));
    }

    deleteBackup(backupId: string): Promise<void> {
        return this.request<void>('DELETE', `/${backupId}`);
    }

    getBackup(backupId: string): Promise<Backup> {
        return this.request<Backup>('GET', `/${backupId}`);
    }

    getBackupDownloadLink(backupId: string): Promise<string> {
        return this.request<string>('GET', `/${backupId}/download`);
    }

    restoreBackup(backupId: string): Promise<void> {
        return this.request<void>('POST', `/${backupId}/restore`);
    }
}