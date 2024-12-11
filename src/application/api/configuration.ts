import * as path from 'node:path';

import { readFileSync } from 'node:fs';
import { getHostAndPortFrommEnvironment } from '../../shared/common/utils/env.utils';


/**
 * configuration function
 * @returns configuration taken from env
 */
export default () => {
    const [ host, port ] = getHostAndPortFrommEnvironment();
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
    };
};
