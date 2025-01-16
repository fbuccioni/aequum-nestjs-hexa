import { ValidationError, ValidationPipe as NestValidationPipe } from "@nestjs/common";
import {
    ValidationException,
    ValidationExceptionErrorDetails,
    ValidationExceptionErrorObject
} from "../../../common/exceptions/validation/validation.exception";
import { conversionFromClassValidatorMap } from "../maps/conversion-from-class-validator.map";


export class ValidationPipe extends NestValidationPipe {
    isDetailedOutputDisabled = false

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

    static validationErrorReducer(errorsObject: ValidationExceptionErrorObject, classValidatorError) {
        errorsObject[classValidatorError.property] = Object.entries(classValidatorError.constraints)
            .reduce(
                this.constraintToDetailsReducer,
                [] as ValidationExceptionErrorDetails
            );

        return errorsObject as ValidationExceptionErrorObject;
    }

    public createExceptionFactory() {
        const self = this.constructor as typeof ValidationPipe;

        return (validationErrors: ValidationError[] = []) => {
            const errors = validationErrors.reduce(
                self.validationErrorReducer.bind(self),
                {} as ValidationExceptionErrorObject
            );

            return new ValidationException(errors);
        };
    }
}
