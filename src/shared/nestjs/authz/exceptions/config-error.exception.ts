export class ConfigError extends Error {
    constructor(message) {
        super(`[Authorization] Config error: ${message}`);
        this.name = 'ConfigError';
    }
}
