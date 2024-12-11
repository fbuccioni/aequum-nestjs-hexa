export function getHostAndPortFrommEnvironment(): [string, number] {
    const listen = process.env.APP_LISTEN;
    let port, host;

    if (/^\d+$/.test(listen)) port = listen;
    else if (/:/.test(listen)) [host, port] = listen.split(':');
    else host = listen;

    if (!port) port = 8000;

    if (!host) host = '127.0.0.1';

    return [host, port];
}
