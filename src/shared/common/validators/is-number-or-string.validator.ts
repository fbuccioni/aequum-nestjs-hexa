import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export function IsNumberOrString(
    validationOptions?: ValidationOptions
): PropertyDecorator {
    return ValidateBy(
        {
            name: 'isNumberOrString',
            validator: {
                validate: (value, args): boolean => (
                    typeof value === 'number' || typeof value === 'string'
                ),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + '$property must be number or string',
                    validationOptions
                ),
            },
        },
        validationOptions
    );
}
