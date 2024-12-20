import { BaseException } from '../base.exception';

import * as dataUtil from '../../utils/data.util';

export type ValidationExceptionErrorDetail = [ code: string, message: string ]
export type ValidationExceptionError = {
    [key: string]: (
        ValidationExceptionErrorDetail
        | { [key: string]: ValidationExceptionError }
    )
}


export class ValidationException extends BaseException {
    static code = 'ERR_VALIDATION_ERROR';

    constructor(public errors: ValidationExceptionError) {
        super('The input object have validation errors');
        if (!errors)  this.errors = {};
    }

    append(errors: ValidationException): void;
    append(errors: ValidationExceptionError): void;
    append(errors: any): void {
        if (errors instanceof ValidationException)
            errors = errors.errors;

        this.errors = dataUtil.mergeDeep(this.errors, errors);
    }
}
