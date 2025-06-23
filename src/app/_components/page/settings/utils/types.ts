export interface Egg {
    id: number;
    name: string;
    requiredEnvVars: Record<string, string>; // key -> default value
}

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

export interface ServerSettingsApiClient {
    getSettings: () => Promise<StartupResponse>;
    updateSettings: (request: UpdateStartupRequest) => Promise<StartupResponse>;
    reinstallServer: () => Promise<void>;
}

export const EGG_OPTIONS: Egg[] = [
    {
        id: 1,
        name: 'Sponge Minecraft',
        requiredEnvVars: {
            'MINECRAFT_VERSION': 'latest',
            'SERVER_JARFILE': 'spongevanilla.jar',
            'MEMORY_LIMIT': '2048'
        }
    },
    {
        id: 2,
        name: 'Vanilla Minecraft',
        requiredEnvVars: {
            'MINECRAFT_VERSION': 'latest',
            'MEMORY_LIMIT': '2048'
        }
    },
    {
        id: 3,
        name: 'Paper Minecraft',
        requiredEnvVars: {
            'MINECRAFT_VERSION': 'latest',
            'BUILD_NUMBER': 'latest',
            'MEMORY_LIMIT': '2048'
        }
    },
    {
        id: 4,
        name: 'BungeeCord Minecraft',
        requiredEnvVars: {
            'BUNGEE_VERSION': 'latest',
            'MEMORY_LIMIT': '1024'
        }
    },
    {
        id: 5,
        name: 'Forge Minecraft',
        requiredEnvVars: {
            'MINECRAFT_VERSION': '1.20.4',
            'FORGE_VERSION': '49.0.31',
            'MEMORY_LIMIT': '2048'
        }
    },
];