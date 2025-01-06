/* Example of a service that extends AuthnService *
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { AuthnService } from "../../shared/nestjs/authn/services/authn.service";

import { UserDto } from "../dtos/user.dto";
import { UsersService } from "./users.service";

@Injectable()
export class AuthService extends AuthnService<UserDto> {
    static fields = AuthnService.extendFields(
        { username: 'email' }
    );

    constructor(
        protected usersService: UsersService,
        protected jwtService: JwtService,
        protected configService: ConfigService
    ) {
        super();
    }
}
/* */
