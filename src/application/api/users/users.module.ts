import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, UserRefreshToken } from '../../../infrastructure/database/entities';
import { UsersService } from '../../services/users.service';
import { UsersController } from './controller/users.controller';


@Module({
    imports: [ TypeOrmModule.forFeature([ User,  UserRefreshToken ]) ],
    providers: [ UsersService ],
    controllers: [ UsersController ],
    exports: [ UsersService ],
})
export class UsersModule {}
