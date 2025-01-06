import { DynamicModule, Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as moduleUtil from '../../shared/nestjs/common/utils/module.util';
import { LoggerInterceptor } from '../../shared/nestjs/logger/interceptors';
import { LoggerModule } from '../../shared/nestjs/logger/logger.module';
import { HttpResponseModule } from '../../shared/nestjs/http-response/http-response.module';
import { HealthModule } from '../../shared/nestjs/health/health.module';

import { SharedInfrastructureModule } from './shared-infrastructure.module';
import  * as APIModules from './api-modules.export';
import configuration from './configuration';

import typeORMConfiguration from '../../infrastructure/database/typeorm.config';
import { JwtGuard } from "../../shared/nestjs/authn/guards/jwt.guard";


/**
 * application modules
 */
@Module({
    imports: [
        CacheModule.register(),
        ConfigModule.forRoot({
            load: [ configuration ],
            isGlobal: true,
            cache: true,
            expandVariables: true,
        }),
        TypeOrmModule.forRoot(
            Object.assign(
                typeORMConfiguration, {
                    autoLoadEntities: false,
                }) as TypeOrmModuleOptions
        ),
        LoggerModule,
        HttpResponseModule,
        HealthModule,
        SharedInfrastructureModule,
        ...moduleUtil.toFlattenArray(APIModules) as DynamicModule[],
    ],
    providers: [
        /* Uncomment this block to enable JWT guard *
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        /* */
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggerInterceptor,
        },
    ],
})
export class AppModule {

}
