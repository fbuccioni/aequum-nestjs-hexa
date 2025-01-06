import { SetMetadata } from "@nestjs/common";

import { publicControllerEndpointMetaKey } from "../constants";


/**
 * Marks endpoint as public (inheritable)
 * @decorator
 */
export const PublicEndpoint =
    () => SetMetadata(publicControllerEndpointMetaKey, true);
