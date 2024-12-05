import { Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/env.objects';
import { validate } from '../config/env.validation';
import { LoggerInterceptor } from '../../core/interceptors';
import * as modules from '../../core/modules';
import { CommonModule } from './common/common.module';

/**`
 * application modules list
 */
const modulesList = Object.keys(modules)
    .map(moduleIndex => modules[moduleIndex as keyof typeof modules]);

/**
 * application module
 */
@Module({
    imports: [
        CacheModule.register(),
        CommonModule,
        ConfigModule.forRoot({
            load: [configuration],
            validate,
            isGlobal: true,
            cache: true,
            expandVariables: true,
        }),
        ...modulesList,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggerInterceptor,
        },
    ],
    controllers: [],
})
export class AppModule {
}
