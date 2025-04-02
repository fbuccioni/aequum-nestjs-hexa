import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

import { JSON } from '../../../common/types/JSON.type';
import { NotFoundException } from "../../../common/exceptions/data/not-found.exception";
import { TokenDto } from "../dtos/token.dto";
import configuration from '../../../../application/api/configuration';
import { UnauthorizedException } from "../../../common/exceptions/auth/unauthorized.exception";
import { AuthCompliantUsersService } from '../interfaces/auth-compliant-users-service.interface';
import {
    AuthRefreshTokenCompliantUsersService
} from '../interfaces/auth-refresh-token-compliant-users-service.interface';
import { ServiceUserFieldsMap } from '../types/service-user-fields-map.type';


/**
 * Abstract class with common things about authentication service.
 */
export abstract class AuthnService<User = any, TokenDTO extends TokenDto = TokenDto> {
    /**
     * Whether to use refresh token, must see static `fields.refreshToken`
     * and `storeRefreshToken` method
     */
    protected static refreshToken: boolean = true;

    /**
     * The users service
     */
    protected usersService: (
        AuthRefreshTokenCompliantUsersService<User>
        | AuthCompliantUsersService<User>
    );

    /**
     * The JWT service from nestjs
     */
    protected jwtService: JwtService;


    /**
     * Default fields map for `User` DTO
     */
    static fields: ServiceUserFieldsMap = {
        username: 'username',
        password: 'password',
        id: 'id',
        refreshToken: 'refreshToken'
    };

    /**
     * Fields map for `User` DTO
     */
    protected fields: ServiceUserFieldsMap;

    protected constructor(
        /**
         * The config service from nestjs
         */
        protected configService: ConfigService
    ) {
        const self = this.constructor as typeof AuthnService;
        const disableRefreshToken = this.configService
            .get<boolean>('authentication.disableRefreshToken');

        if (typeof(disableRefreshToken) !== 'undefined' && disableRefreshToken !== null)
            self.refreshToken = !disableRefreshToken;

        const userFields = this.configService
            .get<Record<string, string>>('authentication.user.fields');

        if ((!userFields) && !this.fields)
            this.fields = self.fields;
        else {
            if (!this.fields) this.fields = {} as ServiceUserFieldsMap;
            for (const field in self.fields)
                if (!this.fields[field])
                    this.fields[field] = userFields[field] || self.fields[field];
        }
    }

    /**
     * Extend the fields
     * @param fields
     */
    static extendFields(fields: Record<string, string>) {
        return Object.assign({}, this.fields, fields);
    }

    /**
     * @ignore
     */
    addExpireDate(date: Date): Date {
        const expiresAfter = this.configService.get<number>('authentication.jwt.expiresAfter');
        return new Date(date.valueOf() + (expiresAfter * 1000));
    }

    /**
     * Payload generator, default only with `sub` and `exp`
     *
     * @param user - User DTO
     * @param issueDate - Date of issue
     */
    async generatePayload(user: User, issueDate: Date): Promise<JSON> {
        // noinspection JSDeprecatedSymbols
        return {
            sub: user[this.fields.id],
            exp: this.addExpireDate(issueDate).getTime() / 1000
        }
    }

    /**
     * Non-descriptive exception about username and password for
     * security reasons.
     *
     * @param inputData
     */
    generateException(inputData: any) {
        return new UnauthorizedException(
            "Wrong username or password", inputData
        );
    }

    /**
     * Login or validate in the NestJS examples
     *
     * @param username
     * @param password
     */
    async login(username: string, password: string): Promise<User> {
        const usernameData = { [this.fields.username]: username };
        const inputData = { ...usernameData, password }

        let user: User;
        try  {
            user = await this.usersService.retrieveBy(usernameData);
        } catch(error) {
            if (!(error instanceof NotFoundException))
                throw error
        }
        if (!user) throw this.generateException(inputData);
        const isMatch: boolean = bcrypt.compareSync(password, user[this.fields.password]);
        if(!isMatch) throw this.generateException(inputData);

        return user;
    }

    /**
     * The login data to expose to user.
     *
     * @param user
     */
    async tokenData(user: User): Promise<TokenDTO> {
        const now = new Date();
        const self = this.constructor as typeof AuthnService;
        const payload = await this.generatePayload(user, now);
        const data = {
            accessToken: await this.jwtService.signAsync(payload as any),
            expiresAt: this.addExpireDate(now).toISOString()
        } as TokenDTO;

        if (self.refreshToken) {
            const usersService = this.usersService as AuthRefreshTokenCompliantUsersService<User>;
            data.refreshToken = await this.jwtService.signAsync({ sub: user[this.fields.id] });
            await usersService.addRefreshToken(user[this.fields.id], data.refreshToken);
        }

        return data;
    }

    /**
     * Refresh the token
     *
     * @param refreshToken The user provided refresh token
     */
    async refreshToken(refreshToken: string) {
        const self = this.constructor as typeof AuthnService;

        if (!self.refreshToken)
            throw new ForbiddenException("Refresh token is disabled");

        try {
            const usersService = this.usersService as AuthRefreshTokenCompliantUsersService<User>;
            const user = await usersService.retrieveByRefreshToken(refreshToken);
            await usersService.removeRefreshToken(user[this.fields.id], refreshToken);
            return this.tokenData(user);
        } catch(err) {
            if (err instanceof NotFoundException)
                throw new UnauthorizedException(
                    'Invalid refresh token', refreshToken
                );

            throw err;
        }
    }

    /**
     * Hash the password
     * @param password
     */
    async hashPassword(password: string): Promise<string> {
        const rounds = this.configService.get<number>('authentication.password.saltRounds') || 10;
        const salt = await bcrypt.genSalt(rounds);
        return bcrypt.hash(password, salt);
    }

    /**
     * Hash the password (static sync version)
     * @param password
     */
    static hashPassword(password: string): string {
        const rounds = (configuration() as any).authentication?.password?.saltRounds || 10;
        const salt = bcrypt.genSaltSync(rounds);
        return bcrypt.hashSync(password, salt);
    }
}
