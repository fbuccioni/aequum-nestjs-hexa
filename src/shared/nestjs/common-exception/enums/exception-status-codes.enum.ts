import { ValidationException } from '../../../common/exceptions/validation/validation.exception';
import { DuplicateEntryException } from '../../../common/exceptions/data/duplicate-entry.exception';
import { NotFoundException } from '../../../common/exceptions/data/not-found.exception';
import { UnauthorizedException } from "../../../common/exceptions/auth/unauthorized.exception";

/**
 * Maps the exception class to its status code
 */
export const ExceptionStatusCodes = {
    [ValidationException.name]: 400,
    [DuplicateEntryException.name]: 409,
    [NotFoundException.name]: 404,
    [UnauthorizedException.name]: 401,
}
