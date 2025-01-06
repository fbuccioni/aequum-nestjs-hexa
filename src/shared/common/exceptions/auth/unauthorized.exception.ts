import { BaseException } from '../base.exception';


export class UnauthorizedException extends BaseException {
    static code = 'ERR_UNAUTHORIZED';

    /**
     * When the user is not authorized to perform an action
     *
     * @param message - The error message,  if empty uses `Not found`
     * @param input - The input that was not found
     * @param cause - The original error
     */
    constructor(
        message?: string ,
        public input?: any,
        cause?: Error
    ) {
        super(message || 'Unauthorized', { cause }, cause?.stack);
    }
}
