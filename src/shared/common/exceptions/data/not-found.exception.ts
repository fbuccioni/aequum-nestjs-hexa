import BaseException from '../base.exception';


export default class NotFoundException extends BaseException {
    static code = 'ERR_NOT_FOUND';

    /**
     * When data is not found
     *
     * @param message - The error message,  if empty uses `Not found`
     * @param input - The input that was not found
     * @param stack - Custom stack trace
     */
    constructor(
        message?: string ,
        public input?: any,
        stack?: string
    ) {
        super(message || 'Not found', null, stack);
    }
}
