/**
 * Maps the exception class to its status code
 */
export const ExceptionStatusCodes = {
    ValidationException: 400,
    DuplicateEntryException: 409,
    NotFoundException: 404,
    UnauthorizedException: 401,

    TokenExpiredException: 401,
    AuthenticationFailException: 401,
}
