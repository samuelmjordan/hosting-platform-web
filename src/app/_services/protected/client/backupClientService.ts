import { Backup } from "@/app/_components/page/backups/utils/types";

export async function listBackups(subscriptionId: string): Promise<Backup[]> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/backups`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to list backups');
    }

    return response.json();
}

export async function createBackup(subscriptionId: string, name: string): Promise<Backup> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/backups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });

    if (!response.ok) {
        throw new Error('failed to create backup');
    }

    return response.json();
}

export async function deleteBackup(subscriptionId: string, backupId: string): Promise<void> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/backups/${backupId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to delete backup');
    }
}

export async function getBackup(subscriptionId: string, backupId: string): Promise<Backup> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/backups/${backupId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to get backup');
    }

    return response.json();
}

export async function getBackupDownloadLink(subscriptionId: string, backupId: string): Promise<string> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/backups/${backupId}/download`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to get backup download link');
    }

    return response.text();
}

export async function restoreBackup(subscriptionId: string, backupId: string): Promise<void> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/backups/${backupId}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to restore backup');
    }
}