export interface Backup {
    id: string;
    name: string;
    ignored_files: string;
    sha256_hash: string;
    bytes: number;
    created_at: number;
    completed_at: number;
}


export interface BackupApiClient {
    listBackups: () => Promise<Backup[]>;
    getBackup: (backupId: string) => Promise<Backup>;
    getBackupDownloadLink: (backupId: string) => Promise<string>;
    createBackup: (name: string) => Promise<Backup>;
    restoreBackup: (backupId: string) => Promise<void>;
    deleteBackup: (backupId: string) => Promise<void>;
}