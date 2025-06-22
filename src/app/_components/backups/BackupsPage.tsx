"use client"

import {useState, useEffect} from 'react';
import { PterodactylBackupClient } from './utils/client';
import { Backup } from './utils/types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner"
import { Loader2, RefreshCw, Download, RotateCcw, Trash2 } from 'lucide-react';

interface BackupsScreenProps {
    subscriptionId: string;
    userId: string;
}

export default function BackupsPage({ subscriptionId, userId }: BackupsScreenProps) {
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newBackupName, setNewBackupName] = useState('');

    // individual operation loading states
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
    const [restoringIds, setRestoringIds] = useState<Set<string>>(new Set());
    const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
    const [refreshing, setRefreshing] = useState(false);

    // dialog states
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        backup: Backup | null;
    }>({ isOpen: false, backup: null });

    const [restoreDialog, setRestoreDialog] = useState<{
        isOpen: boolean;
        backup: Backup | null;
    }>({ isOpen: false, backup: null });

    const client = new PterodactylBackupClient(
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
        userId,
        subscriptionId
    );

    const loadBackups = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            }
            const data = await client.listBackups();
            setBackups(data);
        } catch (err) {
            toast("failed to load backups", {
                description: err instanceof Error ? err.message : 'unknown error occurred'
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const createBackup = async () => {
        if (!newBackupName.trim()) return;

        setCreating(true);
        try {
            await client.createBackup(newBackupName);
            const backupName = newBackupName;
            setNewBackupName('');
            await loadBackups(true);
            toast("backup created", {
                description: `backup "${backupName}" has been created successfully`
            });
        } catch (err) {
            toast("backup creation failed", {
                description: err instanceof Error ? err.message : 'failed to create backup'
            });
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteBackup = async () => {
        if (!deleteDialog.backup) return;

        const backupId = deleteDialog.backup.id;
        const backupName = deleteDialog.backup.name;

        setDeletingIds(prev => new Set(prev).add(backupId));
        setDeleteDialog({ isOpen: false, backup: null });

        try {
            await client.deleteBackup(backupId);
            await loadBackups(true);
            toast("backup deleted", {
                description: `backup "${backupName}" has been deleted`
            });
        } catch (err) {
            toast("delete failed", {
                description: err instanceof Error ? err.message : 'failed to delete backup'
            });
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(backupId);
                return next;
            });
        }
    };

    const handleRestoreBackup = async () => {
        if (!restoreDialog.backup) return;

        const backupId = restoreDialog.backup.id;
        const backupName = restoreDialog.backup.name;

        setRestoringIds(prev => new Set(prev).add(backupId));
        setRestoreDialog({ isOpen: false, backup: null });

        try {
            await client.restoreBackup(backupId);
            toast("restore initiated", {
                description: `backup "${backupName}" restore has been started - this may take several minutes. your server will be unavailable during this process.`,
                duration: 10000, // longer duration for important message
            });
            console.log("backup restored toast");
        } catch (err) {
            toast("restore failed", {
                description: err instanceof Error ? err.message : 'failed to restore backup'
            });
        } finally {
            setRestoringIds(prev => {
                const next = new Set(prev);
                next.delete(backupId);
                return next;
            });
        }
    };

    const downloadBackup = async (backupId: string) => {
        setDownloadingIds(prev => new Set(prev).add(backupId));
        try {
            const downloadUrl = await client.getBackupDownloadLink(backupId);
            window.open(downloadUrl, '_blank');
            toast("download ready", {
                description: "backup download link generated"
            });
        } catch (err) {
            toast("download failed", {
                description: err instanceof Error ? err.message : 'failed to get download link'
            });
        } finally {
            setDownloadingIds(prev => {
                const next = new Set(prev);
                next.delete(backupId);
                return next;
            });
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    useEffect(() => {
        loadBackups();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-muted rounded w-1/4"></div>
                        <div className="h-32 bg-muted rounded"></div>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-muted rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">backups</h1>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadBackups(true)}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'refreshing...' : 'refresh'}
                    </Button>
                </div>

                {/* create new backup */}
                <Card>
                    <CardHeader>
                        <CardTitle>create new backup</CardTitle>
                        <CardDescription>
                            create a backup of your current server state
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3">
                            <Input
                                value={newBackupName}
                                onChange={(e) => setNewBackupName(e.target.value)}
                                placeholder="backup name..."
                                onKeyDown={(e) => e.key === 'Enter' && createBackup()}
                                disabled={creating}
                            />
                            <Button
                                onClick={createBackup}
                                disabled={creating || !newBackupName.trim()}
                            >
                                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {creating ? 'creating...' : 'create'}
                            </Button>
                        </div>
                        {creating && (
                            <p className="text-sm text-muted-foreground mt-2">
                                this might take a while depending on server size...
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* backups list */}
                <Card>
                    <CardHeader>
                        <CardTitle>existing backups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {backups.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">📦</div>
                                <p className="text-muted-foreground">no backups yet</p>
                                <p className="text-sm text-muted-foreground">create your first backup above</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {backups.map((backup) => {
                                    const isDeleting = deletingIds.has(backup.id);
                                    const isRestoring = restoringIds.has(backup.id);
                                    const isDownloading = downloadingIds.has(backup.id);
                                    const isOperating = isDeleting || isRestoring || isDownloading;

                                    return (
                                        <div
                                            key={backup.id}
                                            className={`p-4 border rounded-lg transition-opacity ${
                                                isOperating ? 'opacity-60' : ''
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold">{backup.name}</h3>
                                                        {isRestoring && (
                                                            <Badge variant="secondary">
                                                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                                restoring...
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>size: {formatBytes(backup.bytes)}</span>
                                                        <span>created: {formatDate(backup.created_at)}</span>
                                                        {backup.completed_at && (
                                                            <span>completed: {formatDate(backup.completed_at)}</span>
                                                        )}
                                                    </div>

                                                    {backup.sha256_hash && (
                                                        <div className="text-xs text-muted-foreground font-mono">
                                                            sha256: {backup.sha256_hash.substring(0, 16)}...
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => downloadBackup(backup.id)}
                                                        disabled={isOperating}
                                                    >
                                                        {isDownloading ? (
                                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                        ) : (
                                                            <Download className="h-4 w-4 mr-1" />
                                                        )}
                                                        {isDownloading ? 'getting link...' : 'download'}
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setRestoreDialog({ isOpen: true, backup })}
                                                        disabled={isOperating}
                                                    >
                                                        {isRestoring ? (
                                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                        ) : (
                                                            <RotateCcw className="h-4 w-4 mr-1" />
                                                        )}
                                                        {isRestoring ? 'restoring...' : 'restore'}
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setDeleteDialog({ isOpen: true, backup })}
                                                        disabled={isOperating}
                                                    >
                                                        {isDeleting ? (
                                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                        )}
                                                        {isDeleting ? 'deleting...' : 'delete'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* delete confirmation dialog */}
            <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) =>
                setDeleteDialog({ isOpen: open, backup: deleteDialog.backup })
            }>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>delete backup</AlertDialogTitle>
                        <AlertDialogDescription>
                            are you sure you want to delete "{deleteDialog.backup?.name}"?
                            <br />
                            this action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteBackup}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* restore confirmation dialog */}
            <AlertDialog open={restoreDialog.isOpen} onOpenChange={(open) =>
                setRestoreDialog({ isOpen: open, backup: restoreDialog.backup })
            }>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>restore backup</AlertDialogTitle>
                        <AlertDialogDescription>
                            restore backup "{restoreDialog.backup?.name}"?
                            <br />
                            this will overwrite all current server data and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRestoreBackup}
                            className="bg-yellow-600 text-white hover:bg-yellow-700"
                        >
                            restore
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}