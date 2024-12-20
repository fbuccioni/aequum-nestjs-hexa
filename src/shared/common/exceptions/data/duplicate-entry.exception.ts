import { BaseException } from '../base.exception';
import { ValidationException } from '../validation/validation.exception';
import { ValidationableException } from '../interfaces/validationable-exception.interface';

import * as dataUtil from '../../utils/data.util';


export class DuplicateEntryException extends BaseException implements ValidationableException {
    static code = 'ERR_DUPLICATE_ENTRY';

    /**
     * When data fail to be written due a duplicate entry
     *
     * @param message - The error message, if empty uses `Duplicate entry`
     * @param input - The input data
     * @param uniqueProperties - An array of duplicated properties names
     * @param cause? - The original error
     */
    constructor(
        message?: string,
        public input?: any,
        public uniqueProperties?: string[],
        cause?: Error
    ) {
        super(message || 'Duplicate entry', { cause }, cause?.stack);
    }

    asValidationException() {
        const errors = this.uniqueProperties.reduce(
            (acc, prop) => ({
                ...acc,
                ...dataUtil.objectFromDotNotation(prop, acc, [ this.code, this.message ]),
            }), {}
        );

        return new ValidationException(errors);
    }
}
