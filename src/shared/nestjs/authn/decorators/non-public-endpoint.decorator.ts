import { SetMetadata } from "@nestjs/common";

import { unpublicControllerEndpointMetaKey } from "../constants";


/**
 * Marks endpoint as non-public (non-inheritable)
 * @decorator
 */
export const NonPublicEndpoint =
    () => SetMetadata(unpublicControllerEndpointMetaKey, true);
