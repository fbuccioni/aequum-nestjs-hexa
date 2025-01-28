import { BaseException } from '../base.exception';


export class NotFoundException extends BaseException {
    static code = 'ERR_NOT_FOUND';
    static HTTPStatusCode = 404;

    /**
     * When data is not found
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
        super(message || 'Not found', { cause }, cause?.stack);
    }
}
