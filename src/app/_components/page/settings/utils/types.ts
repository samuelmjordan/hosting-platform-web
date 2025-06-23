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
            'SERVER_JARFILE': 'server.jar',
            'SPONGE_VERSION': '1.12.2-7.3.0'
        }
    },
    {
        id: 2,
        name: 'Vanilla Minecraft',
        requiredEnvVars: {
            'SERVER_JARFILE': 'server.jar',
            'VANILLA_VERSION': 'latest'
        }
    },
    {
        id: 3,
        name: 'Paper Minecraft',
        requiredEnvVars: {
            'SERVER_JARFILE': 'server.jar',
            'MINECRAFT_VERSION': 'latest',
            'BUILD_NUMBER': 'latest'
        }
    },
    {
        id: 4,
        name: 'BungeeCord Minecraft',
        requiredEnvVars: {
            'SERVER_JARFILE': 'bungeecord.jar',
            'BUNGEE_VERSION': 'latest'
        }
    },
    {
        id: 5,
        name: 'Forge Minecraft',
        requiredEnvVars: {
            'SERVER_JARFILE': 'server.jar',
            'MC_VERSION': 'latest',
            'BUILD_TYPE': 'recommended',
            'FORGE_VERSION': ''
        }
    },
];