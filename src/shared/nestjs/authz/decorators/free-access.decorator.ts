import { SetMetadata } from '@nestjs/common';

import { authzFreeMetaKey } from "../constants/metadata.constants";


/**
 * Free a controller or endpoint of any role requirements
 *
 * @decorator
 */
export const FreeAccess = () => SetMetadata(authzFreeMetaKey, true);

