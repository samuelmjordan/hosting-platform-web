'use client'

import { useState, useTransition, useEffect } from 'react';
import { Eye, EyeOff, Check, Server } from 'lucide-react';
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

export default function SftpPage({ subscriptionId }: SftpPageProps) {
    const [credentials, setCredentials] = useState<SftpCredentials | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        loadCredentials();
    }, []);

    const loadCredentials = async () => {
        setIsLoading(true);
        setError(null);

        startTransition(async () => {
            try {
                const creds = await getSftpCredentials(subscriptionId);
                setCredentials(creds);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'failed to load credentials');
            } finally {
                setIsLoading(false);
            }
        });
    };

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('copy failed:', err);
        }
    };

    const maskPassword = (password: string) => {
        return showPassword ? password : '•'.repeat(password.length);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Server className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">sftp credentials</h1>
            </div>

            {isLoading && (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">fetching your credentials...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">error loading credentials</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                    <button
                        onClick={loadCredentials}
                        className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                        retry
                    </button>
                </div>
            )}

            {credentials && (
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                                connection string
                            </label>
                            <div className="flex items-center gap-1">
                                {copiedField === 'connection' && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                        </div>
                        <code
                            className="block bg-gray-50 px-3 py-2 rounded text-sm font-mono break-all cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => copyToClipboard(credentials.connectionString, 'connection')}
                            title="click to copy"
                        >
                            {credentials.connectionString}
                        </code>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">username</label>
                            <div className="flex items-center gap-1">
                                {copiedField === 'username' && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                        </div>
                        <code
                            className="block bg-gray-50 px-3 py-2 rounded text-sm font-mono cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => copyToClipboard(credentials.username, 'username')}
                            title="click to copy"
                        >
                            {credentials.username}
                        </code>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                                password
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {copiedField === 'password' && <Check className="w-4 h-4 text-green-600" />}
                                </div>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <code
                            className="block bg-gray-50 px-3 py-2 rounded text-sm font-mono break-all cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => copyToClipboard(credentials.password, 'password')}
                            title="click to copy"
                        >
                            {maskPassword(credentials.password)}
                        </code>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">port</label>
                            <div className="flex items-center gap-1">
                                {copiedField === 'port' && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                        </div>
                        <code
                            className="block bg-gray-50 px-3 py-2 rounded text-sm font-mono cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => copyToClipboard(credentials.port.toString(), 'port')}
                            title="click to copy"
                        >
                            {credentials.port}
                        </code>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-amber-800 text-sm">
                            Use these credentials with any sftp client like filezilla, winscp, or your terminal
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}