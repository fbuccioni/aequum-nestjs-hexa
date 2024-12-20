import BaseException from '../base.exception';


export default class DuplicateEntryException extends BaseException {
    static code = 'ERR_DUPLICATE_ENTRY';

    /**
     * When data fail to be written due a duplicate entry
     *
     * @param message - The error message, if empty uses `Duplicate entry`
     * @param data - The data that was duplicated
     * @param duplicatedProperties - An array of duplicated properties names
     * @param stack - Custom stack trace
     */
    constructor(
        message?: string,
        data?: any,
        duplicatedProperties?: string[],
        stack?: string
    ) {
        super(
            message || 'Duplicate entry', {
            cause: {
                data,
                duplicated: duplicatedProperties,
            },
            stack
        });
    }
}
