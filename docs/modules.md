aequum NestJS hexagonal boilerplate
===================================

Modules documentation
----------------------

## Table of contents
- [Authentication module (authn)](#authentication-module-authn)
- [User defined components](#user-defined-components)
    - [User model](#user-model)
    - [User service](#user-service)
    - [Authentication service](#authentication-service)
    - [Passport strategy (JWT)](#passport-strategy-jwt)
    - [Authentication controller](#authentication-controller)

## Authentication module (authn)
Provided by `@aequum/nestjs-authn`, the authentication module is 
designed to provide authentication services for the application,
it uses JWT for authentication via passport-jwt strategy and provides
user registration, login and password hashing for user credential.

### User defined components

To implement the authentication module, you must create the following
components:

1. [User model](#user-model)
2. [User service](#user-service)
3. [Authentication service](#authentication-service)
4. [Passport strategy (JWT)](#passport-strategy-jwt)
5. [Authentication controller](#authentication-controller)
6. [Authentication NestJS module](#authentication-nestjs-module)


#### User model

The user model must be implemented in the `domain` layer, must have 
fields  for `username`, `password`, `id` and `refreshToken` if you 
want to use refresh tokens.

Example:
`src/domain/entities/user.entity.ts`
```typescript
import { Types } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsUUID, IsEmail, IsNotEmpty, IsBoolean, IsString, IsEnum } from 'class-validator';

import { Roles } from '../enums/roles.enum';


export class User {
    @IsUUID()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @Transform(({ value }) => ('' + value).toLowerCase())
    @IsEnum(Roles)
    role: Roles;

    @Exclude()
    refreshToken: string[];

    @IsBoolean()
    @IsNotEmpty()
    enabled: boolean;
}
```

#### User service

The users service must be implemented in the `application`
layer, it must implement the interfaces
`AuthCompliantUsersService` or  
`AuthRefreshTokenCompliantUsersService` if you want to use
refresh tokens.

Example:
`src/application/services/users.service.ts`
```typescript
import { Injectable } from '@nestjs/common';

import {
    AuthRefreshTokenCompliantUsersService
} from '@aequum/nestjs-authn/interfaces';
import { BaseCRUDLMongoosePaginatedService } from '@aequum/nestjs-mongoose/services';
import { NotFoundException } from '@aequum/exceptions/data';

import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { User } from '../../infrastructure/database/schemas/user.schema';
import { UserDto } from '../dtos/user.dto';
import { UserCreateDto } from '../dtos/user-create.dto';
import { UserUpdateDto } from '../dtos/user-update.dto';
import { UserPaginatedListDto } from '../dtos/user-paginated-list.dto';


@Injectable()
export class UsersService
    extends BaseCRUDLMongoosePaginatedService<User, UserDto, UserCreateDto, UserUpdateDto, UserPaginatedListDto>
    implements AuthRefreshTokenCompliantUsersService<UserDto>
{
    constructor(protected readonly repository: UserRepository) {
        super();
    }

    async retrieveBy(where: { [key: string]: any }): Promise<UserDto> {
        const user = await this.repository.getOne(where);
        if (!user)
            throw new NotFoundException(`User not found`, where);

        return user as unknown as UserDto;
    }

    async addRefreshToken(id: string, refreshToken: string): Promise<void> {
        await this.repository.pushOnArrayProperty(
            { [this.primaryKeyField]: id },
            'refreshToken',
            refreshToken
        );
    }

    async removeRefreshToken(id: string, refreshToken: string): Promise<void> {
        await this.repository.pullFromArrayProperty(
            { [this.primaryKeyField]: id },
            'refreshToken',
            refreshToken
        );
    }

    async retrieveByRefreshToken(refreshToken: string): Promise<UserDto> {
        return this.retrieveBy({ refreshToken });
    }
}
```

#### Authentication service

It must be implemented in the `application` layer, it provides
login, jwt, password hashing and refresh token (if enabled) 
functionality, it must extends the abstract class 
`AuthnService`.

Example:
`src/application/services/authn.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthnService } from '../../shared/nestjs/authn/services/authn.service';
import { UserDto } from '../dtos/user.dto';
import { UsersService } from './users.service';
import { TokenDto } from '../interfaces/token-dto.interface';


@Injectable()
export class AuthService extends AuthnService<UserDto, TokenDto> {
    constructor(
        protected usersService: UsersService,
        protected jwtService: JwtService,
        protected configService: ConfigService
    ) {
        super(configService);
    }

    async tokenData(user: UserDto): Promise<TokenDto> {
        const data: TokenDto = await super.tokenData(user);
        data.role = user.role;

        return data;
    }
}
```

#### Passport strategy (JWT)

It must be implemented in the `application` layer, it provides
the JWT authentication strategy for the application, it must
extend the abstract class `JwtAbstractStrategy`.

Example:
`src/application/auth/passport/strategies/jwt.strategy.ts`
```typescript
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtStrategy as JwtAbstractStrategy } from '@aequum/nestjs-authn/passport/strategies';

import { UserDto } from '../../../../dtos/user.dto';
import { UsersService } from '../../../../services/users.service';


@Injectable()
export class JwtStrategy extends JwtAbstractStrategy<UserDto> {
    constructor(
        protected configService: ConfigService,
        protected usersService: UsersService
    ) {
        super(configService);
    }
}
```

#### Authentication controller

It must be implemented in the `application` layer, it provides
the endpoints for user registration, login and refresh token (if
enabled),it must extends the abstract class `AuthnController`.

Example:
`src/application/controllers/authn.controller.ts`
```typescript
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { LoginDto, TokenDto, TokenRefreshDto } from '@aequum/nestjs-authn/dtos';
import { AuthnController } from '@aequum/nestjs-authn/controller";

import { AuthService } from '../../../services/auth.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthController extends AuthnController(
    LoginDto, TokenDto, TokenRefreshDto
) {

    public constructor(protected authService: AuthService) {
        super(authService);
    }
}
```


#### Authentication NestJS module

The authentication module must be implemented in the `application`
layer and it takes all the previously defined components to provide
the authentication functionality for the application.

Example:
`src/application/auth/auth.module.ts`
```typescript
import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "../../services/auth.service";
import { UsersModule } from "../users/users.module";
import { JwtStrategy } from "./passport/strategies/jwt.strategy";
import { AuthController } from "./controllers/auth.controller";

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
```

### Set up the authentication guard
To set up the authentication guard, you must import the `AuthModule`
in the main application module and set up the guard in the
`app.module.ts` file of the application.

Example:
`src/application/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtGuard } from '@aequum/nestjs-authn/guards';

import * as APIModules from './api-modules.export';
import configuration from './configuration';


@Module({
    imports: [
        CacheModule.register(),
        ConfigModule.forRoot({
            load: [ configuration ],
            isGlobal: true,
            cache: true,
            expandVariables: true,
        }),
        SharedInfrastructureModule,
        ...APIModules
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        // ... other providers
    ],
})
export class AppModule {}
```

### Configuration

To configure the authentication module, you must create a configuration
file in the `application` layer, it must implement the
`AuthnConfiguration` interface.

Example:
`src/application/configuration.ts`
```typescript
import { env as envUtils } from '@aequum/utils';

export default () => {
    return {
        // other configurations ...
        authentication: {
            swagger: process.env.AUTH_SWAGGER || null,
            password: {
                saltRounds: (+process.env.AUTH_PASSWORD_SALT_ROUNDS) || 10,
            },
            jwt: {
                secret: process.env.AUTH_JWT_SECRET || 'secret',
                expiresAfter: (+process.env.AUTH_JWT_EXPIRES_AFTER_SECS) || 3600,
            },
            disableRefreshToken: envUtils.asBoolean(process.env.AUTH_DISABLE_REFRESH_TOKEN),
            user:{
                fields: { // To map custom user fields on User DTO
                    username: process.env.AUTH_USER_FIELD_USERNAME,
                    password: process.env.AUTH_USER_FIELD_PASSWORD,
                    id: process.env.AUTH_USER_FIELD_ID,
                    refreshToken: process.env.AUTH_USER_FIELD_REFRESH_TOKEN,
                }
            }
        }
    };
};
```
