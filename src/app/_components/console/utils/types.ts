export interface ServerStats {
    memory_bytes: number;
    memory_limit_bytes: number;
    cpu_absolute: number;
    network: {
        rx_bytes: number;
        tx_bytes: number;
    };
    state: string;
    disk_bytes: number;
}

export interface AnsiSpan {
    text: string;
    className: string;
}

export type PowerSignal = 'start' | 'stop' | 'restart' | 'kill';
export type ServerStatus = 'running' | 'starting' | 'stopping' | 'offline';
