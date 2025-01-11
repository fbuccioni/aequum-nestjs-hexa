import { SetMetadata } from "@nestjs/common";

import { authnRequiredMetaKey } from "../constants/metadata.constants";


/**
 * Controller or endpoints that mandatory requires authentication (non-inheritable)
 * @decorator
 */
export const requireAuthentication =
    () => SetMetadata(authnRequiredMetaKey, true);

