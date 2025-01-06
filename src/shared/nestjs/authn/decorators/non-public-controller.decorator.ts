import { SetMetadata } from "@nestjs/common";

import { unpublicControllerMetaKey } from "../constants";


/**
 * Marks controller as non-public (non-inheritable)
 * @decorator
 */
export const NonPublicController =
    () => SetMetadata(unpublicControllerMetaKey, true);

