import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';


export function load() {
    expand(dotenv.config());
}

export function asBoolean(s: string) {
    return ['y', 'yes', '1', 'true', 't'].includes(s.toLowerCase())
}
