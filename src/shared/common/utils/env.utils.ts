import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';


export function load() {
    expand(dotenv.config());
}

export function asBoolean(s: any, defaultValue: boolean = false): boolean {
    if (typeof(s) === 'string')
        return ['y', 'yes', '1', 'true', 't'].includes(s.toLowerCase())

    if (['boolean', 'number'].includes(typeof s))
        return !!s

    return defaultValue
}
