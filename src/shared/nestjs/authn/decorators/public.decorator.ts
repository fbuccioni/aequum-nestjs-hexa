import { SetMetadata } from "@nestjs/common";

import { authnPublicMetaKey } from "../constants/metadata.constants";


/**
 * Public controllers or endpoints (inheritable)
 * @decorator
 */
export const Public =
    () => SetMetadata(authnPublicMetaKey, true);

