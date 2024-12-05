import { HttpException } from '@nestjs/common';
import { HttpResponse } from '../domain/interfaces';

type GenericObject = Record<string, unknown>;   

/**
 * implements http exception with http response from the service of common module
 */
export class HttpResponseException extends HttpException {
    /**
     * Http response exception contructor
     * @param data Http response
     */
    constructor(data: HttpResponse) {
        super(HttpException.createBody<GenericObject>(data as unknown as GenericObject), data.status);
    }
}
