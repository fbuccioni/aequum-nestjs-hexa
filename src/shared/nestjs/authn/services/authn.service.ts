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
    protected jwtService: JwtService


    /**
     * The config service from nestjs
     */
    protected configService: ConfigService;

    /**
     * Fields map for `User` DTO
     */
    static fields = {
        username: 'username',
        password: 'password',
        id: 'id',
        refreshToken: 'refreshToken'
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
        const expiresAfter = this.configService.get<number>('auth.jwt.expiresAfter');
        return new Date(date.valueOf() + (expiresAfter * 1000));
    }

    /**
     * Payload generator, default only with `sub` and `exp`
     *
     * @param user - User DTO
     */
    async generatePayload(user: User, issueDate: Date): Promise<JSON> {
        const self = this.constructor as typeof AuthnService
        return {
            sub: user[self.fields.id],
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
        const self = this.constructor as typeof AuthnService;
        const usernameData = { [self.fields.username]: username };
        const inputData = { ...usernameData, password }

        let user: User;
        try  {
            user = await this.usersService.retrieveBy(usernameData);
        } catch(error) {
            if (!(error instanceof NotFoundException))
                throw error
        }
        if (!user) throw this.generateException(inputData);

        const isMatch: boolean = bcrypt.compareSync(password, user[self.fields.password]);
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
            data.refreshToken = await this.jwtService.sign({ sub: user[self.fields.id] });
            this.storeRefreshToken(user, data.refreshToken);
        }

        return data;
    }

    /**
     * Refresh the token
     *
     * @param token
     */
    async refreshToken(token: string) {
        const self = this.constructor as typeof AuthnService;
        const user = await this.usersService.retrieveBy({
            [self.fields.refreshToken]: token
        });

        if (!user) throw new NotFoundException("Invalid token");

        return this.tokenData(user);
    }


    /**
     * Store the refresh token in the user
     *
     * @param user
     * @param token
     */
    async storeRefreshToken(user: User, token: string) {
        const self = this.constructor as typeof AuthnService;

        this.usersService.update(
            user[self.fields.id], { refreshToken: token }
        )
    }

    /**
     * Hash the password
     * @param password
     */
    async hashPassword(password: string): Promise<string> {
        const rounds = this.configService.get<number>('auth.password.saltRounds');
        const salt = await bcrypt.genSalt(rounds);
        return bcrypt.hash(password, salt);
    }

    /**
     * Hash the password (static sync version)
     * @param password
     */
    static hashPassword(password: string): Promise<string> {
        const rounds = (configuration() as any).auth.password.saltRounds;
        const salt = bcrypt.genSaltSync(rounds);
        return bcrypt.hashSync(password, salt);
    }
}
