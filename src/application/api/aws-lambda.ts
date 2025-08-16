/**
 * AWS Lambda handler
 */

/* For detailed information about serverless in this
 * boilerplate see:
 * https://github.com/fbuccioni/aequum-nestjs-hexa#serverless
 */

/** *
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@nestjs/common';
import { awsLambdaFastify } from '@fastify/aws-lambda';

import { bootstrap } from './main';


export async function handler(
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    const app = await bootstrap(
        { logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console }
    );
    const proxy = awsLambdaFastify(app.getHttpAdapter().getInstance() as any);
    return proxy(event, context);
}
/** */