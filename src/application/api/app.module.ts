import { DynamicModule, Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { module as moduleUtil } from '@aequum/nestjs-common/utils';
import { JwtGuard } from  '@aequum/nestjs-authn/guards';
// import { RBACGuard } from  '@aequum/nestjs-authz/guards';

import { LoggerInterceptor } from '../../shared/nestjs/logger/interceptors';
import { LoggerModule } from '../../shared/nestjs/logger/logger.module';
import { HealthModule } from '../../shared/nestjs/health/health.module';
import { SharedInfrastructureModule } from './shared-infrastructure.module';
import * as APIModules from './api-modules.export';
import configuration from './configuration';


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
        LoggerModule,
        HealthModule,
        SharedInfrastructureModule,
        ...moduleUtil.toFlattenArray(APIModules) as DynamicModule[],
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        /* Uncomment this block to enable RBAC guard *
        {
            provide: APP_GUARD,
            useClass: RBACGuard,
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
