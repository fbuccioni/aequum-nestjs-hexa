import { DataSourceOptions } from 'typeorm';


export function URIToDataSourceOptions(uri: string):  DataSourceOptions {
    let parsedURI: URL;

    try {
        parsedURI = new URL(uri);
    } catch (err) {
        // @ts-ignore
        if (err instanceof TypeError && err.code === 'ERR_INVALID_URL') {
            err.message = `Invalid database URI '${uri}'`;
            // @ts-ignore
            err.code = 'ERR_INVALID_DATABASE_URI';
        }

        throw err;
    }

    const [ database, schema ] = parsedURI.pathname.split('/').slice(1);

    const additionalConfig = {};
    if (parsedURI.search)
        Object.assign(additionalConfig, Object.fromEntries(new URLSearchParams(parsedURI.search)));

    return {
        // @ts-ignore
        type: parsedURI.protocol.substring(0, parsedURI.protocol.length - 1),
        host: parsedURI.hostname,
        username: parsedURI.username,
        password: parsedURI.password,
        database,
        schema,
        port: (+parsedURI.port) || undefined,
        ... additionalConfig
    };
}
