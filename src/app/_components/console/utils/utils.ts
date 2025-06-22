export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KiB', 'MiB', 'GiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getStatusColor(status: string): string {
    switch (status) {
        case "running": return "text-emerald-400";
        case "starting": return "text-amber-400";
        case "stopping": return "text-orange-400";
        case "offline": return "text-red-400";
        default: return "text-slate-400";
    }
}

export function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "running": return "default";
        case "starting": return "secondary";
        case "stopping": return "outline";
        case "offline": return "destructive";
        default: return "secondary";
    }
}