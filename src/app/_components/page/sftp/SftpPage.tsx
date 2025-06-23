'use client'

import { useState, useTransition, useEffect } from 'react';
import { Eye, EyeOff, Copy, Server, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getSftpCredentials } from './utils/actions';

interface SftpCredentials {
    connectionString: string;
    username: string;
    password: string;
    port: number;
}

interface SftpPageProps {
    subscriptionId: string;
}

type ErrorType = 'network' | 'auth' | 'server' | 'unknown';

interface ApiError extends Error {
    status?: number;
    code?: string;
}

export default function SftpPage({ subscriptionId }: SftpPageProps) {
    const [credentials, setCredentials] = useState<SftpCredentials | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<{ type: ErrorType; message: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        loadCredentials();
    }, []);

    const getErrorType = (err: unknown): { type: ErrorType; message: string } => {
        if (err instanceof Error) {
            const apiError = err as ApiError;

            if (apiError.status === 401 || apiError.status === 403) {
                return { type: 'auth', message: 'access denied - check your permissions' };
            }

            if (apiError.status === 404) {
                return { type: 'server', message: 'subscription not found' };
            }

            if (apiError.status && apiError.status >= 500) {
                return { type: 'server', message: 'server error - try again later' };
            }

            if (apiError.name === 'NetworkError' || apiError.message.includes('fetch')) {
                return { type: 'network', message: 'connection failed - check your internet' };
            }

            return { type: 'unknown', message: apiError.message };
        }

        return { type: 'unknown', message: 'something went wrong' };
    };

    const loadCredentials = async () => {
        setError(null);

        startTransition(async () => {
            try {
                const creds = await getSftpCredentials(subscriptionId);
                setCredentials(creds);
            } catch (err) {
                setError(getErrorType(err));
            }
        });
    };

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                description: `${fieldName} copied to clipboard`,
                duration: 2000,
            });
        } catch (err) {
            toast({
                variant: "destructive",
                description: "failed to copy - try selecting manually",
                duration: 3000,
            });
        }
    };

    const getErrorIcon = (type: ErrorType) => {
        switch (type) {
            case 'auth':
            case 'server':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const CredentialField = ({
                                 label,
                                 value,
                                 type = 'text',
                                 showToggle = false
                             }: {
        label: string;
        value: string;
        type?: 'text' | 'password';
        showToggle?: boolean;
    }) => (
        <div className="space-y-2">
            <Label htmlFor={label.toLowerCase().replace(' ', '-')}>{label}</Label>
            <div className="flex">
                <Input
                    id={label.toLowerCase().replace(' ', '-')}
                    type={type === 'password' && !showPassword ? 'password' : 'text'}
                    value={value}
                    readOnly
                    className="font-mono text-sm"
                    aria-label={`${label} field`}
                />
                <div className="flex ml-2 gap-1">
                    {showToggle && (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'hide password' : 'show password'}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(value, label)}
                        aria-label={`copy ${label}`}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">sftp credentials</h1>
            </div>

            {isPending && (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">loading credentials...</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {error && (
                <Alert variant={error.type === 'auth' ? 'destructive' : 'default'}>
                    {getErrorIcon(error.type)}
                    <AlertDescription className="flex items-center justify-between">
                        <span>{error.message}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadCredentials}
                            disabled={isPending}
                        >
                            retry
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {credentials && (
                <div className="space-y-6">
                    <Card>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto p-6">
                            <CredentialField
                                label="connection string"
                                value={credentials.connectionString}
                            />
                            <CredentialField
                                label="username"
                                value={credentials.username}
                            />
                            <CredentialField
                                label="password"
                                value={credentials.password}
                                type="password"
                                showToggle={true}
                            />
                            <CredentialField
                                label="port"
                                value={credentials.port.toString()}
                            />
                        </CardContent>
                    </Card>

                    <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                            try using filezilla, winscp, cyberduck, or terminal clients like sftp and scp
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}