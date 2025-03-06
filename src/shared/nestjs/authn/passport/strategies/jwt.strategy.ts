import { Strategy, ExtractJwt } from 'passport-jwt';
import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { JwtPayload as DefaultJwtPayload } from "../../models/jwt-payload.model";


/**
 * Abstract class with common things about a simple JWT strategy.
 *
 */
export abstract class JwtStrategy<UserDto, JwtPayload extends Record<string, any> = DefaultJwtPayload> extends PassportStrategy(Strategy) {
    protected readonly usersService: any;

    constructor(
        protected readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('authentication.jwt.secret'),
        });
    }

    /**
     * Method to validate the payload of the JWT.
     *
     * @param payload - Payload of the JWT
     */
    async validate(payload: JwtPayload): Promise<UserDto> {
        if (!payload?.sub) throw new Error('Invalid payload');

        const user: UserDto = this.usersService.retrieve(payload.sub);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
