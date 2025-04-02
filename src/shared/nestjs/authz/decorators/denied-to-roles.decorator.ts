import { SetMetadata } from '@nestjs/common';

import { authzDenyRolesMetaKey } from "../constants/metadata.constants";


/**
 * Deny roles for a controller or endpoint
 *
 * @decorator
 */
export const DeniedToRoles =
    (...roles: any[]) => SetMetadata(authzDenyRolesMetaKey, roles);
