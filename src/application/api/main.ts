import morgan from 'morgan';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';


/**
 * Main entry point of the application
 * @returns Nothing`
 */
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

        // OpenAPI
        const config = new DocumentBuilder()
            .setTitle(configService.get<string>('app.title'))
            .setDescription(configService.get<string>('app.description'))
            .setVersion(configService.get<string>('app.version'))
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);

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
