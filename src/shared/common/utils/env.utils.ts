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
export function asBoolean(s: any, defaultValue?: boolean): boolean | undefined {
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

/**
 * Convert an environment string variable separated by commas to
 * an array of strings.
 *
 * @param s - String to convert
 * @param defaultValue - Default value if string is not array or
 * a non-empty string.
 */
export function asArray(s: any, defaultValue?: string[] | null ): string[] | null | undefined {
    if (Array.isArray(s)) return s;
    if (typeof s === 'string' && s) return s.trim().split(/\s*,\s*/g);

    return defaultValue;
}


/**
 * Convert an environment string variable to a number
 *
 * @param s - String to convert
 * @param defaultValue - Default value if the string is not a number
 */
export function asInteger(s: any, defaultValue?: number | null ): number | null | undefined {
    if (typeof s === 'number') return s;
    if (typeof s === 'string' && s) {
        const n = parseInt(s, 10);
        if (!isNaN(n)) return n;
    }

    return defaultValue;
}
