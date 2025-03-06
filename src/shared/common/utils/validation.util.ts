import { validate } from 'class-validator';


/**
 * validates output dtos and throws an error if it is wrong
 *
 * @param dto dtos
 * @param logger logger service
 */
export async function validateOutputDTO(dto: any, logger: any): Promise<any> {
    const errors = await validate(dto);

    if (errors.length) {
        for (const error of errors) {
            logger.error(error);
        }
    }

    return dto;
}
