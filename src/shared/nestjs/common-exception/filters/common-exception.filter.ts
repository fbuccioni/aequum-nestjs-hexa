import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { ValidationableException } from '../../../common/exceptions/interfaces/validationable-exception.interface';
import { BaseException } from '../../../common/exceptions/base.exception';
import { HttpResponseDescriptions } from '../../http-response/enums';


@Catch(BaseException)
export class CommonExceptionFilter implements ExceptionFilter {
    catch(exception: BaseException & ValidationableException, host: ArgumentsHost) {
        if (typeof exception.asValidationException !== 'undefined')
            exception = exception.asValidationException();

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const statusCode = (exception.constructor as typeof BaseException).HTTPStatusCode || 500;
        const errorResponseBody = {
            statusCode,
            description: HttpResponseDescriptions[
                HttpStatus[statusCode].toString() as keyof typeof HttpResponseDescriptions
            ],
            ...exception // Exceptions can be converted in plain objects
        } as unknown as HttpException

        response.status(statusCode)
        response.send(errorResponseBody);
    }
}
