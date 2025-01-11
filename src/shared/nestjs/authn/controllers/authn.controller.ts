import { PARAMTYPES_METADATA } from '@nestjs/common/constants';
import { Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthnService } from '../services/authn.service';
import { Public } from '../decorators';


/**
 * Factory function to create an AuthnController class, a controller with authentication operations.
 *
 * The generated controller will have:
 * - HTTP return codes
 * - Swagger decorators `@ApiOperation` and `@ApiResponse`
 * - Properly typed parameters for input and output of the methods
 * - Properly typed parameters for the ID and body
 *
 * NOTE: All types will be processed with `InstanceType` to get the correct type to work with.
 *
 * @typeParam LoginDtoType - Type from `LoginDto` parameter. (`typeof LoginDto`)
 * @typeParam TokenDtoType - Type from `TokenDto` parameter. (`typeof TokenDto`)
 * @typeParam TokenRefreshDtoType - Type from `TokenRefreshDto` parameter. (`typeof TokenRefreshDto`)
 *
 * @param LoginDto - The DTO class for the login data.
 * @param TokenDto - The DTO class for the token data.
 * @param TokenRefreshDto - The DTO class for the token refresh data.
 *
 * @returns The AuthnController class.
 */
export function AuthnController<
    LoginDtoType extends new (...args: any[]) => any,
    TokenDtoType extends new (...args: any[]) => any,
    TokenRefreshDtoType extends new (...args: any[]) => any,
>(
    LoginDto: LoginDtoType,
    TokenDto: TokenDtoType,
    TokenRefreshDto: TokenRefreshDtoType
) {
    type LoginDtoRealType = InstanceType<LoginDtoType>;
    type TokenDtoRealType = InstanceType<TokenDtoType>;
    type TokenRefreshDtoRealType = InstanceType<TokenRefreshDtoType>;

    @Public()
    class AuthnController {
        constructor(protected authService: AuthnService<any>) {}

        @ApiOperation({ summary: 'Login' })
        @ApiResponse({ status: 200, description: 'Login successful', type: TokenDto})
        @ApiResponse({ status: 401, description: 'Unauthorized' })
        @Post('login')
        async login(
            @Body() loginData: LoginDtoRealType
        ): Promise<TokenDtoRealType> {
            const user = await this.authService.login(
                loginData.username,
                loginData.password
            );
            return this.authService.tokenData(user) as TokenDtoRealType;
        }

        @ApiOperation({ summary: 'Refresh token'})
        @ApiResponse({ status: 200, description: 'Token refreshed', type: TokenDto})
        @Post('token/refresh')
        async refreshToken(
            @Body() tokenData: TokenRefreshDtoRealType
        ): Promise<TokenDtoRealType> {
            const user = await this.authService.refreshToken(tokenData.token);
            return this.authService.tokenData(user) as TokenDtoRealType;
        }
    }

    // Workaround to fix the issues with the metadata
    type KeyDataTuple = [string, any[]];
    const setMethodsParamTypeMeta = (keysData: KeyDataTuple[]) => {
        for (const [key, data] of keysData)
            Reflect.defineMetadata(
                PARAMTYPES_METADATA,
                data,
                AuthnController.prototype,
                key
            );
    };

    setMethodsParamTypeMeta([
        ['login', [LoginDto]],
        ['refreshToken', [TokenRefreshDto]],
    ]);
    // End workaround

    return AuthnController;
}
