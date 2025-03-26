import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

/**
 * Load environment variables from .env file, using
 * `dotenv` and `dotenv-expand` packages.
 */
export function load() {
    expand(dotenv.config());
}

/**
 * Convert an environment string variable to a boolean.
 *
 * @param s - String to convert
 * @param defaultValue - Default value if the string is not a boolean
 */
export function asBoolean(s: any, defaultValue: boolean = false): boolean {
    switch (typeof(s)) {
        case 'boolean':
            return s;
        case 'string':
            return ['y', 'yes', '1', 'true', 't'].includes(s.toLowerCase());
        case 'number':
            return !!s;
        default:
            return defaultValue;
    }
}
