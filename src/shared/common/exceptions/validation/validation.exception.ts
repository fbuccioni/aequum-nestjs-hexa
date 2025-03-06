import * as dataUtil from '../../utils/data.util';
import { BaseException } from '../base.exception';


export type ValidationExceptionErrorDetail = [
    code: string,
    message: string,
    constraints?: any[],
];

export type ValidationExceptionErrorDetails = ValidationExceptionErrorDetail[];
export type ValidationExceptionErrorObject = {
    [key: string]: ValidationExceptionError
}
export type ValidationExceptionError = (
    ValidationExceptionErrorDetails
    | ValidationExceptionErrorObject
)


export class ValidationException extends BaseException {
    static code = 'ERR_VALIDATION_ERROR';
    static HTTPStatusCode = 400;

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
