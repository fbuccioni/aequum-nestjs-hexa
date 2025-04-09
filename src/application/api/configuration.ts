import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import * as envUtils from '../../shared/common/utils/env.utils';


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
            cors: {
                enabled: !!Object.keys(process.env).filter(k => k.startsWith('APP_API_CORS_')).length,
                origin: ( process.env.APP_API_CORS_ORIGIN || '' ).split(/\s*,\s*/),
                methods: envUtils.asArray(
                    process.env.APP_API_CORS_METHODS,
                    ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
                ),
                allowHeaders: envUtils.asArray(
                    process.env.APP_API_CORS_ALLOW_HEADERS,
                    undefined
                ),
                exposedHeaders: envUtils.asArray(
                    process.env.APP_API_CORS_EXPOSE_HEADERS,
                    undefined
                ),
                credentials: envUtils.asBoolean(process.env.APP_API_CORS_CREDENTIALS, undefined),
                maxAge: envUtils.asInteger(process.env.APP_API_CORS_MAX_AGE, undefined),
                preflightContinue: envUtils.asBoolean(process.env.APP_API_CORS_PREFLIGHT_CONTINUE, false),
                optionsSuccessStatus: envUtils.asInteger(process.env.APP_API_CORS_OPTIONS_SUCCESS_STATUS, 204),
            }
        },
        authentication: {
            swagger: process.env.AUTH_SWAGGER || null,
            password: {
                saltRounds: (+process.env.AUTH_PASSWORD_SALT_ROUNDS) || 10,
            },
            jwt: {
                secret: process.env.AUTH_JWT_SECRET || 'secret',
                expiresAfter: (+process.env.AUTH_JWT_EXPIRES_AFTER_SECS) || 3600,
            },
            disableRefreshToken: envUtils.asBoolean(process.env.AUTH_DISABLE_REFRESH_TOKEN),
            user:{
                fields: { // To map custom user fields on User DTO
                    username: process.env.AUTH_USER_FIELD_USERNAME,
                    password: process.env.AUTH_USER_FIELD_PASSWORD,
                    id: process.env.AUTH_USER_FIELD_ID,
                    refreshToken: process.env.AUTH_USER_FIELD_REFRESH_TOKEN,
                }
            }
        },
        authorization: {
            // See the RBACGuard class for more information
            rolesUserProperty: process.env.AUTHORIZATION_ROLES_USER_PROPERTY,
            defaultPolicy: process.env.AUTHORIZATION_DEFAULT_POLICY,
            whenNoUser: process.env.AUTHORIZATION_WHEN_NO_USER,
        }
    };
};
