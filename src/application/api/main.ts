import morgan from 'morgan';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { CommonExceptionFilter } from '../../shared/nestjs/common-exception/filters/common-exception.filter';
import { swaggerAuthModName } from '../../shared/nestjs/authn/utils/authn.util';


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
        const openAPIAuthMod = configService.get<string>('auth.swagger');
        if (openAPIAuthMod)
            docBuilder[`add${swaggerAuthModName(openAPIAuthMod)}Auth`]();

        const config = docBuilder.build()
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(`${pathPrefix}/spec`, app, document);

        let [ port, host ] = [
            configService.get<number>('app.port'),
            configService.get<string>('app.host')
        ]

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

bootstrap();
