import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { authnPublicMetaKey, authnRequiredMetaKey, } from "../constants/metadata.constants";
import { TokenExpiredException } from "../exceptions/token-expired.exception";
import { AuthenticationFailException } from "../exceptions/authentication-fail.exception";


/**
 * Same as AuthGuard('jwt') but with the ability to allow public endpoints
 * marked with the decorator `@Public()`.
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    /**
     * Whether the endpoint requires authentication.
     *
     * @param endpointMethodHandler
     * @param controllerClass
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    endpointRequiresAuth(endpointMethodHandler: Function, controllerClass: any) {
        return (
            (!!this.reflector.getAllAndOverride(authnRequiredMetaKey, [ controllerClass ]))
            || (!!this.reflector.getAllAndOverride(
                authnRequiredMetaKey, [ endpointMethodHandler, controllerClass ]
            ))
        )
    }

    /**
     * Wherer the controller is public (no authentication required).
     *
     * @param controllerClass - Class of the controller.
     */
    controllerIsPublic(controllerClass: any) {
        return !!this.reflector.getAllAndOverride(authnPublicMetaKey, [ controllerClass ]);
    }

    /**
     * Whether the endpoint is public (no authentication required).
     *
     * @param endpointMethodHandler - Method handler of the endpoint.
     * @param controllerClass - Class of the controller.
     */
    endpointIsPublic(endpointMethodHandler: Function, controllerClass: any) {
        return (
            this.controllerIsPublic(controllerClass) || (
                !!this.reflector.getAllAndOverride(
                    authnPublicMetaKey, [ endpointMethodHandler, controllerClass ]
                )
            )
        )
    }

    /**
     * Whether the context of the endpoint is public (no authentication required).
     *
     * @param context - Endpoint excution context.
     */
    contextIsPublic(context: ExecutionContext): boolean {
        if (this.endpointRequiresAuth(context.getHandler(), context.getClass()))
            return false;

        const classWithParents = (c): any[] => {
            if (!c.name) return [];
            return [c, ...classWithParents(Object.getPrototypeOf(c))]
        };

        return classWithParents(context.getClass())
            .map((c) => this.endpointIsPublic(context.getHandler(), c))
            .some((isPublic) => isPublic)
    }

    canActivate(
        context: ExecutionContext,
    ): Promise<boolean> | boolean | Observable<boolean> {
        if (this.contextIsPublic(context)) return true;
        return super.canActivate(context);
    }

    /**
     * Handle the request, this is just to catch errors on authentication
     *
     * @throws AuthenticationFailException on any fail
     * @throws TokenExpiredException on token expired
     *
     * @param err - Error
     * @param user - Request user object
     * @param info - Info (this can be an exception too)
     * @param context - Execution context for endpoint
     *
     * @see {@link https://docs.nestjs.com/recipes/passport#extending-guards}
     */
    handleRequest<TUser = any>(err, user, info, context): TUser {
        if (err || !user) {
            const token = context
                .switchToHttp()
                .getRequest()
                .headers?.authorization?.replace(/^.*?[ ]/, '')
            ;

            if (info.name === 'TokenExpiredError')
                throw new TokenExpiredException(
                    { method: 'jwt', expiredAt: info.expiredAt,  token },
                    info
                )

            throw err || new AuthenticationFailException(
                (typeof info === 'string' ? info : undefined),
                { method: 'jwt', token },
                (err instanceof Error) ? err : (info instanceof Error) ? info : undefined
            );
        }
        return user;
    }
}
