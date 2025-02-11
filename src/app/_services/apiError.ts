export class APIError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'APIError';
    }
}