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

    endpointRequiresAuth(endpointMethodHandler: Function, controllerClass: any) {
        return (
            (!!this.reflector.getAllAndOverride(authnRequiredMetaKey, [ controllerClass ]))
            || (!!this.reflector.getAllAndOverride(
                authnRequiredMetaKey, [ endpointMethodHandler, controllerClass ]
            ))
        )
    }

    controllerIsPublic(controllerClass: any) {
        return !!this.reflector.getAllAndOverride(authnPublicMetaKey, [ controllerClass ]);
    }

    endpointIsPublic(endpointMethodHandler: Function, controllerClass: any) {
        return (
            this.controllerIsPublic(controllerClass) || (
                !!this.reflector.getAllAndOverride(
                    authnPublicMetaKey, [ endpointMethodHandler, controllerClass ]
                )
            )
        )
    }

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
}
