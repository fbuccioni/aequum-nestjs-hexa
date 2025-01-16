import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { JSON } from '../../../common/types/JSON.type';
import { NotFoundException } from "../../../common/exceptions/data/not-found.exception";

import { TokenDto } from "../dtos/token.dto";
import { ConfigService } from "@nestjs/config";

import configuration from '../../../../application/api/configuration';
import { UnauthorizedException } from "../../../common/exceptions/auth/unauthorized.exception";


export abstract class AuthnService<User = any, TokenDTO extends TokenDto = TokenDto> {
    /**
     * Whether to use refresh token, must see static `fields.refreshToken`
     * and `storeRefreshToken` method
     */
    protected static refreshToken: boolean = true;

    /**
     * The users service
     */
    protected usersService: any;

    /**
     * The JWT service from nestjs
     */
    protected jwtService: JwtService;


    /**
     * Default fields map for `User` DTO
     */
    static fields: { [k: string]: string } = {
        username: 'username',
        password: 'password',
        id: 'id',
        refreshToken: 'refreshToken'
    }

    /**
     * Fields map for `User` DTO
     */
    protected fields: { [k: string]: string };

    constructor(
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
            if (!this.fields) this.fields = {};
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
     */
    async generatePayload(user: User, issueDate: Date): Promise<JSON> {
        return {
            sub: user[this.fields.id],
            exp: this.addExpireDate(issueDate).getTime() / 1000
        }
    }

    /**
     * Non descriptive exception about username and password for
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
            token: await this.jwtService.sign(payload as any),
            expiresAt: this.addExpireDate(now).toISOString()
        } as TokenDTO;

        if (self.refreshToken) {
            data.refreshToken = await this.jwtService.sign({ sub: user[this.fields.id] });
            await this.storeRefreshToken(user, data.refreshToken);
        }

        return data;
    }

    /**
     * Refresh the token
     *
     * @param token
     */
    async refreshToken(refreshToken: string) {
        try {
            const user = await this.usersService.retrieveBy({
                [this.fields.refreshToken]: refreshToken
            });

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
     * Store the refresh token in the user
     *
     * @param user
     * @param token
     */
    async storeRefreshToken(user: User, token: string) {
        await this.usersService.update(
            user[this.fields.id], { refreshToken: token }
        )
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
    static hashPassword(password: string): Promise<string> {
        const rounds = (configuration() as any).authentication?.password?.saltRounds || 10;
        const salt = bcrypt.genSaltSync(rounds);
        return bcrypt.hashSync(password, salt);
    }
}
