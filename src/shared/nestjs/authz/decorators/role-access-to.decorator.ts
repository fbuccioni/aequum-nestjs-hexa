import { SetMetadata } from '@nestjs/common';

import { authzAllowRolesMetaKey } from "../constants/metadata.constants";


/**
 * Allow roles for a controller or endpoint
 *
 * @decorator
 */
export const RoleAccessTo =
    (...roles: any[]) => SetMetadata(authzAllowRolesMetaKey, roles);

