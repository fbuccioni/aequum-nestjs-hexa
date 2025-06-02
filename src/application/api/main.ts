import morgan from 'morgan';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { swagger as swaggerUtil } from '@aequum/nestjs-common/utils';
import { CommonExceptionFilter } from '@aequum/nestjs-exceptions';

import { AppModule } from './app.module';


async function bootstrap() {
    // Http Server using fastify
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    );

    app.use(morgan('dev'));
    app.useGlobalPipes(
        new ValidationPipe({
            disableErrorMessages: false,
        }),
    );

    try {
        const configService = app.get(ConfigService);
        const pathPrefix = `api/${configService.get<string>('api.version')}`;

        app.setGlobalPrefix(pathPrefix);
        app.useGlobalFilters(new CommonExceptionFilter())

        // OpenAPI
        const docBuilder = new DocumentBuilder()
            .setTitle(configService.get<string>('app.title'))
            .setDescription(configService.get<string>('app.description'))
            .setVersion(configService.get<string>('app.version'))

        // Simple OpenAPI auth module add
        const openAPIAuthMod = configService.get<string>('authentication.swagger');
        if (openAPIAuthMod)
            docBuilder[`add${swaggerUtil.authModName(openAPIAuthMod)}Auth`]();

        const config = docBuilder.build()
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

        // Listen
        const [ port, host ] = [
            configService.get<number>('app.port'),
            configService.get<string>('app.host')
        ];

        await app.listen(port, host, () =>
            Logger.log(
                `HTTP Service is listening on port ${port}`,
                'System'
            ),
        );
    } catch (error) {
        console.log(error);
        return;
    }
}

void bootstrap();
