/* An example of a JwtStrategy *
import { ConfigService } from  '@nestjs/config';
import { Injectable } from  '@nestjs/common';
import { 
    JwtStrategy as JwtAbstractStrategy 
} from '@aequum/nestjs-authn/passport/strategies';

import { UserDto } from  '../../../../dtos/user.dto';
import { UsersService } from  '../../../../services/users.service';


@Injectable()
export class JwtStrategy extends JwtAbstractStrategy<UserDto> {
    constructor(
        protected configService: ConfigService,
        protected usersService: UsersService
    ) {
        super(configService);
    }
}
/* */
