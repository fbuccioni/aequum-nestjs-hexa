import { BaseException } from "../../../common/exceptions/base.exception";


export class AuthenticationFailException extends BaseException {
    static code = 'ERR_AUTHN_FAIL';

    constructor(
        message,
        public input: { [ k: string ]: any },
        cause?: Error
    ) {
        super(message || 'Authentication fail', { cause }, cause?.stack);
    }
}
