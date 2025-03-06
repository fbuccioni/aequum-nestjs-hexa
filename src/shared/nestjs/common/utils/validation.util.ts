import { validate } from 'class-validator';
import { HttpStatus } from '@nestjs/common';

import { HttpResponseException } from '../../http-response/exceptions';


/**
 * validates dtos and returns bad request if it is wrong
 *
 * @param dto dtos
 * @param httpResponseGenerator http response service
 */
export async function validateDTO(dto: any, httpResponseGenerator: any): Promise<any> {
    const errors = await validate(dto);

    if (errors.length) throw new HttpResponseException(httpResponseGenerator.generate(HttpStatus.BAD_REQUEST, errors));

    return dto;
}
