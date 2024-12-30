import { DuplicateEntryException } from '../exceptions/data/duplicate-entry.exception';


type PossiblyMongoServerError = Error & { code: number }

export function isDuplicateError(err: PossiblyMongoServerError) {
    return (
        err.name === 'MongoServerError' && err.code === 11000
        && err.message.match(/(duplicate|unique (key|constraint)|primary key|E11000)/i)
    )
}

export function duplicateEntryExceptionOrError<T extends Error>(
    err: T, message?: any,
    data?: any, duplicatedProperties?: string[]
): T | DuplicateEntryException {
    if (isDuplicateError(err as unknown as PossiblyMongoServerError))
        return new DuplicateEntryException(
            message,
            data,
            duplicatedProperties,
            err
        );

    return err;
}
