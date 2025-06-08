import { Module } from  '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from  '@nestjs/config';

import { AuthService } from  '../../services/auth.service';
import { UsersModule } from  '../users/users.module';
import { JwtStrategy } from  './passport/strategies/jwt.strategy';
import { AuthController } from  './controllers/auth.controller';


@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('authentication.jwt.secret'),
            }),
        }),
    ],
    providers: [ JwtStrategy, AuthService ],
    controllers: [ AuthController ],
})
export class AuthModule {}
