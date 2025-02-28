import { BaseException } from "../../../common/exceptions/base.exception";


export class TokenExpiredException extends BaseException {
    static code = 'ERR_AUTHN_TOKEN_EXPIRED';
    static HTTPStatusCode = 401;

    constructor(
        public input?: { [k: string]: any },
        cause?: Error
    ) {
        super('Authentication token expired', { cause }, cause?.stack);
    }
}
