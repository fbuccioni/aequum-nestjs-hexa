/* An example of an Auth Controller *
import { ApiTags } from "@nestjs/swagger";
import { Controller } from '@nestjs/common';
import { AuthnController } from "@aequum/nestjs-authn/controllers";
import { 
    LoginDto,
    TokenDto,
    TokenRefreshDto
} from "@aequum/nestjs-authn/dtos";

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
