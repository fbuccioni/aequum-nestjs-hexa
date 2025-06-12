import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../../../infrastructure/database/repositories/user.repository';
import { UserRefreshToken, User} from '../../../infrastructure/database/entities';
import { UsersService } from '../../services/users.service';
import { UsersController } from './controller/users.controller';


@Module({
    imports: [ TypeOrmModule.forFeature([ User,  UserRefreshToken ]) ],
    providers: [ UsersService, UserRepository ],
    controllers: [ UsersController ],
    exports: [ UsersService ],
})
export class UsersModule {}
