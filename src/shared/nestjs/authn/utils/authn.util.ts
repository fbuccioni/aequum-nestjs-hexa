/**
 * Get NestJS Swagger auth type name with some aliases
 *
 * @param auth - Auth type
 */
export function swaggerAuthModName(auth: string) {
    if (auth === 'jwt') return 'Bearer';
    if (auth === 'oauth2') return 'OAuth2';
    return auth[0].toUpperCase() + auth.slice(1);
}
