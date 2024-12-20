import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { BaseException } from '../../../common/exceptions/base.exception';
import { ExceptionStatusCodes } from '../enums/exception-status-codes.enum';
import { HttpResponseDescriptions } from '../../http-response/enums';
import { ValidationableException } from '../../../common/exceptions/interfaces/validationable-exception.interface';


@Catch(BaseException)
export class CommonExceptionFilter implements ExceptionFilter {
    catch(exception: BaseException & ValidationableException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();

        let statusCode = 500;

        if (typeof exception.asValidationException !== 'undefined')
            exception = exception.asValidationException();

        if (typeof ExceptionStatusCodes[exception.name] !== 'undefined')
            statusCode = ExceptionStatusCodes[exception.name];

        const ErrorResponse = {
            statusCode,
            description: HttpResponseDescriptions[
                HttpStatus[statusCode].toString() as keyof typeof HttpResponseDescriptions
            ],
            ...exception // Exceptions can be converted in plain objects
        }

        response.status(statusCode)
        response.send(ErrorResponse);
    }
}
