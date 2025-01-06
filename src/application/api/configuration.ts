import * as path from 'node:path';

import { readFileSync } from 'node:fs';


/**
 * configuration function
 * @returns configuration taken from env
 */
export default () => {
    const [ host, port ] = [
        process.env.API_LISTEN_HOST || 'localhost',
        ( +process.env.API_LISTEN_PORT ) || 8085
    ];
    const { name, title, version, description }: any = JSON.parse(
        readFileSync(path.join(__dirname, '..', '..', '..', 'package.json'), 'utf-8')
    );

    return {
        app: {
            name,
            title,
            version,
            description,
            host,
            port,
            env: process.env.NODE_ENV,
        },
        api: {
            version: process.env.API_VERSION,
        },
    };
};
