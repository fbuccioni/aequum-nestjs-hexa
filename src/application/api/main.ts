import morgan from 'morgan';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { swagger as swaggerUtil } from '@aequum/nestjs-common/utils';
import { CommonExceptionFilter } from '@aequum/nestjs-exceptions';

import { AppModule } from './app.module';


const serverlessRunModes = [ 'aws-lambda' ];

const runMode = process.env.APP_RUN_MODE || 'http';
const isServerless = serverlessRunModes.includes(runMode);

export async function bootstrap(appOptions?: any) {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        appOptions
    );

    app.use(morgan('dev'));
    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);
    const pathPrefix = `api/${configService.get<string>('api.version')}`;

    app.setGlobalPrefix(pathPrefix);
    app.useGlobalFilters(new CommonExceptionFilter());

    // OpenAPI
    const docBuilder = new DocumentBuilder()
        .setTitle(configService.get<string>('app.title'))
        .setDescription(configService.get<string>('app.description'))
        .setVersion(configService.get<string>('app.version'))
        .setOpenAPIVersion('3.0.3');

    // Simple OpenAPI auth module add
    const openAPIAuthMod = configService.get<string>(
        'authentication.swagger',
    );
    if (openAPIAuthMod)
        docBuilder[`add${swaggerUtil.authModName(openAPIAuthMod)}Auth`]();

    const config = docBuilder.build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${pathPrefix}/spec`, app, document);

    // CORS
    const corsConfig: any = configService.get<object>('api.cors') || {};
    if ( corsConfig.enabled )
        app.enableCors(Object.fromEntries(
            Object.entries(corsConfig).filter(
                ([ k, v ]: [ string, any ]) => (
                    v !== undefined && k != 'enabled'
                )
            )
        ));

    // When run mode is `http` listen on specified port
    if ( runMode === 'http' ) {
        const [ port, host ] = [
            configService.get<number>('app.port'),
            configService.get<string>('app.host'),
        ];

        await app.listen(port, host, () =>
            Logger.log(`HTTP Service is listening on port ${port}`, 'System'),
        );
    } else {
        await app.init();
    }

    return app;
}


export const handler = async (...args: any[]) => {
    if (!isServerless)
        throw new TypeError(
            'This handler is only for serverless mode, '
            + 'check your APP_RUN_MODE env var'
        );

    const module = await require(`./${runMode}`)
    if (!module.handler)
        throw new ReferenceError(
            `No handler found in module ./${runMode}`
            + ' check the module for the handler'
        );

    return module.handler(...args)
};

if (!isServerless)
    void bootstrap();