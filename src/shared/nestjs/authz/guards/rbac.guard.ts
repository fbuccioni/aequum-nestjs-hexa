import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
    authzAllowRolesMetaKey,
    authzDenyRolesMetaKey,
    authzFreeMetaKey
} from "../constants/metadata.constants";
import { Policies, Policy } from '../types/policies.type';
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { RolePropertyNotFoundException } from "../exceptions/role-property-not-found.exception";
import { WhenNoUserAction, WhenNoUserActions } from "../types/when-no-user-actions.type";
import { ConfigService } from "@nestjs/config";
import { ConfigError } from "../exceptions/config-error.exception";


/**
 * RBAC Guard to allow or deny access to endpoints based on the policies by
 * decorators `@DeniedToRoles`, `@RoleAccessTo`.and `@FreeAccess`.
 *
 * Hardcoded rules:
 * :
 * - `@FreeAccess` just Allow without questions.
 * - When use `@RoleAccessTo` the default policy turns to `deny`.for the endpoint
 *
 * Settings:
 *
 * - Roles property on user can be specified in the property `rolesUserProperty`.
 *   or config  `authorization.rolesUserProperty`.
 * - Default policy can be specified in the property `defaultPolicy`.or config
 *   `authorization.defaultPolicy` with values 'allow' (by default) or 'deny'.
 * - When no user is found action can be changed in the property `whenNoUser`.
 *   or config `authorization.whenNoUser`.with values 'return-default-policy'
 *   (by default), 'allow-access', 'deny-access' or 'throw-error'
 */
@Injectable()
export class RBACGuard implements CanActivate {
    /**
     * Property name on user object that contains the roles.
     * @protected
     */
    protected rolesUserProperty: string;

    /**
     * Default policy to apply when no roles are defined.
     * @protected
     */
    protected defaultPolicy : Policy = 'allow';


    /**
     * What to do when no user is found.
     * @protected
     */
    protected whenNoUser: WhenNoUserAction = 'return-default-policy';

    constructor(
        protected readonly reflector: Reflector,
        protected readonly configService: ConfigService,
    ) {
        const rolesUserProperty = this.configService.get<string>('authorization.rolesUserProperty');
        if (rolesUserProperty) this.rolesUserProperty = rolesUserProperty;

        const defaultPolicy = this.configService.get<string>('authorization.defaultPolicy');
        if (defaultPolicy) {
            if (!Policies.includes(defaultPolicy as Policy))
                throw new ConfigError(
                    `\`defaultPolicy\` must be \`${Policies.join('\`, \`')}\`, but got ${defaultPolicy}`
                )
            this.defaultPolicy = defaultPolicy as Policy;
        }

        const whenNoUser = this.configService.get<string>('authorization.whenNoUser');
        if (whenNoUser) {
            if (!WhenNoUserActions.includes(whenNoUser as WhenNoUserAction))
                throw new ConfigError(
                    `\`whenNoUser\` must be \`${WhenNoUserActions.join('\`, \`')}\`, but got ${whenNoUser}`
                )

            this.whenNoUser = whenNoUser as WhenNoUserAction;
        }
    }

    /**
     * What to do when no user is found.
     *
     * @throws Error when the user is not found and `whenNoUser` is `throwError`.
     */
    whenNoUserAction() {
        if (this.whenNoUser === 'return-default-policy')
            return this.defaultPolicy === 'allow';
        else if (this.whenNoUser === 'allow-access')
            return true;
        else if (this.whenNoUser === 'deny-access')
            return false;
        else
            throw new UserNotFoundException()
    }

    /**
     * Get name of the roles property in user object, this should be provided
     * in the property `rolesUserProperty`, but if the property is not settled
     * try to guess it from the object on `role` or `roles` properties.
     *
     * @throws Error when no roles property cannot be guessed.
     * @throws Error when the configured roles property is not found
     * in the user object
     * @param userObject - User object to get the roles property.
     */
    getRolesUserProperty(userObject) {
        if (typeof this.rolesUserProperty === 'undefined' || !this.rolesUserProperty) {
            if (userObject?.role) return 'role';
            if (userObject?.roles) return 'roles';

            throw new Error('RBACGuard: Roles property not found on user object');
        }

        if (typeof userObject[this.rolesUserProperty] === 'undefined')
            throw new RolePropertyNotFoundException(this.rolesUserProperty);

        return this.rolesUserProperty;
    }

    /**
     * Whether the endpoint has free access.
     *
     * @param endpointMethodHandler - Method handler of the endpoint.
     * @param controllerClass - Class of the controller.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    endpointHasFreeAccess(endpointMethodHandler: Function, controllerClass: any) {
        return (
            this.controllerHasFreeAccess(controllerClass) || (
                !!this.reflector.getAllAndOverride(
                    authzFreeMetaKey, [ endpointMethodHandler, controllerClass ]
                )
            )
        )
    }

    /**
     * Whether the controller has free access.
     *
     * @param controllerClass
     */
    controllerHasFreeAccess(controllerClass: any) {
        return !!this.reflector.getAllAndOverride(authzFreeMetaKey, [ controllerClass ]);
    }

    /**
     * Get roles from metadata of a controller or endpoint using the
     * provided meta key.
     *
     * @private
     * @param metaKey - Key of the metadata to get.
     * @param endpointMethodHandler - Method handler of the endpoint.
     * @param controllerClass - Class of the controller.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    private rolesFromMeta(metaKey: string, endpointMethodHandler: Function, controllerClass: any) {
        const classWithParents = (c): any[] => {
            if (!c.name) return [];
            return [c, ...classWithParents(Object.getPrototypeOf(c))]
        };

        const classAndParents = classWithParents(controllerClass);
        const controllerRoles: any[] = classAndParents.map((c) => (
                this.reflector.getAllAndOverride(
                    metaKey, [ c ]
                ) || []
            ))
            .flat();

        const endpointRoles: any[] = classAndParents.map((c) => (
                this.reflector.getAllAndOverride(
                    metaKey, [ endpointMethodHandler, controllerClass ]
                ) || []
            ))
            .flat()

        return Array.from(new Set([ ...controllerRoles, ...endpointRoles ]))
    }

    /**
     * Get roles that are denied to access the endpoint.
     *
     * @param endpointMethodHandler - Method handler of the endpoint.
     * @param controllerClass - Class of the controller.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    endpointDeniedRoles(endpointMethodHandler: Function, controllerClass: any) {
        return this.rolesFromMeta(authzDenyRolesMetaKey, endpointMethodHandler, controllerClass);
    }

    /**
     * Get roles that are allowed to access the endpoint.
     *
     * @param endpointMethodHandler - Method handler of the endpoint.
     * @param controllerClass - Class of the controller.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    endpointAllowedRoles(endpointMethodHandler: Function, controllerClass: any) {
        return this.rolesFromMeta(authzAllowRolesMetaKey, endpointMethodHandler, controllerClass);
    }

    /**
     * Whether the context for the endpoint is allowed to access or not
     *
     * @param context - Endpoint excution context.
     * @throws Error when the user is not found and `whenNoUser` is `throwError`.
     * @throws Error when no roles property cannot be guessed.
     * @throws Error when the configured roles property is not found
     * in the user object
     */
    contextIsAuthorized(context: ExecutionContext): boolean {
        if (this.endpointHasFreeAccess(context.getHandler(), context.getClass()))
            return true;

        const allowedRoles = this.endpointAllowedRoles(context.getHandler(), context.getClass())
        const hasAllowedRoles = allowedRoles.length > 0;
        const defaultPolicy = (
            (hasAllowedRoles)
                ? false
                : this.defaultPolicy === 'allow'
        );

        const { user } = context.switchToHttp().getRequest();
        if (!user) return this.whenNoUserAction();

        const rolesUserProperty = this.getRolesUserProperty(user);
        const userRoles: string[] = (
            Array.isArray(user[rolesUserProperty])
            ? user[rolesUserProperty]
            : [ user[rolesUserProperty] ]
        );

        const deniedRoles = this.endpointDeniedRoles(context.getHandler(), context.getClass())

        if (
            deniedRoles.length > 0
            && deniedRoles.some((role) => userRoles.includes(role))
        )
            return false;

        if (
            hasAllowedRoles
            && allowedRoles.some((role) => userRoles.includes(role))
        )
            return true;

        return defaultPolicy;
    }

    /**
     * @inheritdoc
     */
    canActivate(
        context: ExecutionContext,
    ): Promise<boolean> | boolean | Observable<boolean> {
        return this.contextIsAuthorized(context);
    }
}
