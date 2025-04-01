import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';


export function IsCoordinate(
    validationOptions?: ValidationOptions
): PropertyDecorator {
    return ValidateBy(
        {
            name: 'isCoordinate',
            validator: {
                validate: (value, args): boolean => (
                    Array.isArray(value)
                    && value.length > 1
                    && value.every((v) => typeof v === 'number' && !isNaN(v))
                ),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + '$property must be a valid coordinate',
                    validationOptions
                ),
            },
        },
        validationOptions
    );
}
