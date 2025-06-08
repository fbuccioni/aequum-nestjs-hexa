import { Module } from '@nestjs/common';

import { UserRepository } from '../../../infrastructure/database/repositories/user.repository';
import { UsersService } from '../../services/users.service';
import { UsersController } from './controller/users.controller';


@Module({
    providers: [ UsersService, UserRepository ],
    controllers: [ UsersController ],
    exports: [ UsersService ],
})
export class UsersModule {}
