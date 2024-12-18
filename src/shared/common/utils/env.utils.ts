import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';


export function load() {
    expand(dotenv.config());
}

export function hostAndPort(listen: string): [ string, number ] {
    let host: string = undefined;
    let port: number = undefined;

    if (!listen) return [ host, port ];

    if (/^\d+$/.test(listen)) port = +listen;
    else if (/:/.test(listen))
        [ host, port ] = listen
            .split(':')
            .map((e, i) => i === 1 ? +e : e) as [ string, number ];
    else host = listen;

    if (!port) port = 8085;
    if (!host) host = 'localhost';

    return [ host, port ];
}

export function asBoolean(s: string) {
    return ['y', 'yes', '1', 'true', 't'].includes(s.toLowerCase())
}
