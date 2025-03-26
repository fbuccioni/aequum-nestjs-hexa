import { ValidationError, ValidationPipe as NestValidationPipe } from "@nestjs/common";

import {
    ValidationException,
    ValidationExceptionErrorDetails,
    ValidationExceptionErrorObject
} from "../../../common/exceptions/validation/validation.exception";
import { conversionFromClassValidatorMap } from "../maps/conversion-from-class-validator.map";


/**
 * Custom validation pipe that converts class-validator errors to a custom exception
 *
 * @see ValidationException
 * @see https://docs.nestjs.com/pipes#the-built-in-validationpipe
 */
export class ValidationPipe extends NestValidationPipe {
    isDetailedOutputDisabled = false

    /**
     * @ignore
     */
    static constraintToDetailsReducer(
        validationExceptionErrorsDetails: ValidationExceptionErrorDetails,
        [ constraintName, message ]: [ string, string ]
    ) {
        const conversionMapEntry = conversionFromClassValidatorMap[constraintName];

        if (conversionMapEntry) {
            let constraints = [];
            if (conversionMapEntry.constraintsRegexp) {
                constraints = message.match(conversionMapEntry.constraintsRegexp)?.slice(1);
            }

            validationExceptionErrorsDetails.push([ conversionMapEntry.code, message, constraints ]);
        } else {
            validationExceptionErrorsDetails.push([
                'ERR_VAL_UNKNOWN',
                `Unknown validation error: ${message}`
            ]);
        }

        return validationExceptionErrorsDetails;
    }

    /**
     * Reducer function that converts a class-validator constraint
     * errors to a `ValidationExceptionErrorDetails` object
     *
     * @param errorsObject - The object to append the error
     * @param classValidatorError - `class-validator` errors object
     */
    static validationErrorReducer(errorsObject: ValidationExceptionErrorObject, classValidatorError: any) {
        errorsObject[classValidatorError.property] = Object.entries(classValidatorError.constraints)
            .reduce(
                this.constraintToDetailsReducer,
                [] as ValidationExceptionErrorDetails
            );

        return errorsObject;
    }

    /**
     * Creates a factory function that creates a `ValidationException` object
     * from a `class-validator` error object
     */
    public createExceptionFactory() {
        const self = this.constructor as typeof ValidationPipe;

        return (validationErrors: ValidationError[] = []) => {
            const errors = validationErrors.reduce(
                self.validationErrorReducer.bind(self),
                {}
            ) as ValidationExceptionErrorObject;

            return new ValidationException(errors);
        };
    }
}
