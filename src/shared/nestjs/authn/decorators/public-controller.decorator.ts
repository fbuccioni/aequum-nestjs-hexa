import { SetMetadata } from "@nestjs/common";

import { publicControllerMetaKey } from "../constants";


/**
 * Marks controller as public (inheritable)
 * @decorator
 */
export const PublicController =
    () => SetMetadata(publicControllerMetaKey, true);

