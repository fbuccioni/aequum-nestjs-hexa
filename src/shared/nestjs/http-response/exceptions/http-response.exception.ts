import { HttpException } from '@nestjs/common';

import { HttpResponse } from 'src/shared/common/interfaces';


/**
 * implements http exceptions with http response from the service of common modules
 */
export class HttpResponseException extends HttpException {
    /**
     * Http response exceptions contructor
     * @param data Http response
     */
    constructor(data: HttpResponse) {
        super(HttpException.createBody<HttpResponse>(data), data.status);
    }
}
