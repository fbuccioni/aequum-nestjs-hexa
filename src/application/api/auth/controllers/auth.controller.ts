/* An example of an Auth Controller *
import { ApiTags } from "@nestjs/swagger";
import { Controller } from '@nestjs/common';

import { LoginDto } from "../../../../shared/nestjs/authn/dtos/login.dto";
import { TokenDto } from "../../../../shared/nestjs/authn/dtos/token.dto";
import { TokenRefreshDto } from "../../../../shared/nestjs/authn/dtos/token-refresh.dto";
import { AuthnController } from "../../../../shared/nestjs/authn/controllers/authn.controller";
import { AuthService } from "../../../services/auth.service";


@ApiTags('Auth')
@Controller('auth')
export class AuthController extends AuthnController(
    LoginDto, TokenDto, TokenRefreshDto
) {

    public constructor(
        protected authService: AuthService,
    ) {
        super(authService);
    }
}
/* */
