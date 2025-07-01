export interface StartupResponse {
    startup_command: string;
    image: string;
    egg_id: number;
    installed: boolean;
    environment: Record<string, string>;
}

export interface UpdateStartupRequest {
    startup_command: string;
    environment: Record<string, string>;
    egg_id: number;
    image: string;
}